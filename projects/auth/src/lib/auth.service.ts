import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthenticationControllerService, LoginResponse, LoginUserDto } from  '@carconfig/api-client';
import { SnackbarService } from '@carconfig/shared';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly EXPIRATION_KEY = 'tokenExpiration';
  private readonly LAST_ACTIVITY_KEY = 'lastUserActivity';
  private readonly IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
  private readonly MIN_TOKEN_LIFETIME_MS = 5 * 60 * 1000; // 5 minutes minimum
  private readonly authApiService = inject(AuthenticationControllerService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);
  private readonly transloco = inject(TranslocoService);

  // Signals for token and expiration
  readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  readonly expiration = signal<number | null>(
    (() => {
      const v = localStorage.getItem('tokenExpiration');
      return v ? Number(v) : null;
    })()
  );
  private idleTimeoutHandle?: ReturnType<typeof setTimeout>;

  // Computed signal for login state (modern signal style)
  readonly isLoggedIn = computed(() => {
    const t = this.token();
    const e = this.expiration();
    return !!t && !!e && Date.now() < e!;
  });

  private expirationTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    // Persist token changes to localStorage
    effect(() => {
      const t = this.token();
      if (t) {
        localStorage.setItem(this.TOKEN_KEY, t);
      } else {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    });

    effect(() => {
      const e = this.expiration();
      if (e) {
        localStorage.setItem(this.EXPIRATION_KEY, e.toString());
      } else {
        localStorage.removeItem(this.EXPIRATION_KEY);
      }
    });

    // Schedule expiration handling whenever expiration changes
    effect(() => {
      const e = this.expiration();
      if (!e) {
        console.log('[AUTH] No expiration set');
        this.clearExpirationTimeout();
        return;
      }
      const ms = e - Date.now();
      console.log('[AUTH] Expiration effect triggered:', { expirationTime: e, nowTime: Date.now(), msUntilExpiry: ms });
      if (ms <= 0) {
        console.log('[AUTH] Token expired immediately - triggering handleTokenExpired');
        this.handleTokenExpired();
        return;
      }
      this.clearExpirationTimeout();

      // setTimeout has a max delay of ~24 days (2^31-1 ms). For longer delays, use max value
      const timeoutMs = Math.min(ms, 2147483647); // Max safe setTimeout delay
      console.log('[AUTH] Setting expiration timeout in', timeoutMs, 'ms (requested:', ms, 'ms)');

      this.expirationTimeout = setTimeout(() => {
        console.log('[AUTH] Expiration timeout triggered');
        this.handleTokenExpired();
      }, timeoutMs);
    });

    this.setupOnlineOfflineListeners();

    // Start or clear the inactivity timeout whenever the login state changes.
    effect(() => {
      if (this.isLoggedIn()) this.scheduleIdleTimeout();
      else this.clearIdleTimeout();
    });
    this.setupActivityTracking();
  }

  getToken(): string | null {
    return this.isLoggedIn() ? this.token() : null;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginUserDto = { email, password };
    return this.authApiService.authenticate(loginRequest).pipe(
      tap((response: LoginResponse) => {
        console.log('[AUTH] Login response received:', { token: !!response.token, expiresIn: response.expiresIn });
        if (response.token) {
          localStorage.setItem(this.LAST_ACTIVITY_KEY, Date.now().toString());
          this.token.set(response.token);
          // Use backend expiresIn or default to 1 hour
          const backendExpiresInSecs = response.expiresIn || 3600;
          const backendExpiresInMs = backendExpiresInSecs * 1000;

          // Ensure minimum token lifetime to prevent immediate expiration
          const expirationTime = Math.max(backendExpiresInMs, this.MIN_TOKEN_LIFETIME_MS);
          const expirationTimestamp = Date.now() + expirationTime;

          console.log('[AUTH] Setting expiration:', {
            backendExpiresInSecs,
            backendExpiresInMs,
            MIN_TOKEN_LIFETIME_MS: this.MIN_TOKEN_LIFETIME_MS,
            expirationTime,
            expirationTimestamp,
            nowPlus5Min: Date.now() + this.MIN_TOKEN_LIFETIME_MS
          });

          this.expiration.set(expirationTimestamp);
          this.router.navigate(['/']);
        }
      })
    );
  }
  hasValidToken(): boolean {
    const token = this.token();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  logout(message?: string): void {
    if (message) {
      try {
      this.snackbar.show(this.transloco.translate(message));
      } catch {}
    }
    this.clearExpirationTimeout();
    this.clearIdleTimeout();
    localStorage.removeItem(this.LAST_ACTIVITY_KEY);
    this.token.set(null);
    this.expiration.set(null);
    this.router.navigate(['/login']);
  }

  private clearExpirationTimeout(): void {
    if (this.expirationTimeout) {
      clearTimeout(this.expirationTimeout);
      this.expirationTimeout = undefined;
    }
  }

  private handleTokenExpired(): void {
    this.clearIdleTimeout();
    localStorage.removeItem(this.LAST_ACTIVITY_KEY);
    this.token.set(null);
    this.expiration.set(null);
    try {
      this.snackbar.show(this.transloco.translate('auth.sessionExpired'));
    } catch {}
    this.router.navigate(['/login']);
  }

  private setupActivityTracking(): void {
    if (typeof window === 'undefined') return;

    const onActivity = () => {
      if (this.isLoggedIn()) this.resetIdleTimeout();
    };
    for (const eventName of ['pointerdown', 'keydown', 'scroll', 'touchstart']) {
      window.addEventListener(eventName, onActivity, { passive: true });
    }
    let lastPointerMoveAt = 0;
    window.addEventListener('pointermove', () => {
      const now = Date.now();
      if (now - lastPointerMoveAt >= 1000) {
        lastPointerMoveAt = now;
        onActivity();
      }
    }, { passive: true });
    window.addEventListener('storage', (event) => {
      if (event.key === this.LAST_ACTIVITY_KEY && event.newValue && this.isLoggedIn()) this.scheduleIdleTimeout();
    });
  }

  private setupOnlineOfflineListeners(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('offline', () => {
      this.logout('auth.connectionLost');
    });
  }

  private resetIdleTimeout(): void {
    if (!this.isLoggedIn()) return;
    localStorage.setItem(this.LAST_ACTIVITY_KEY, Date.now().toString());
    this.scheduleIdleTimeout();
  }

  private scheduleIdleTimeout(): void {
    this.clearIdleTimeout();
    const lastActivity = Number(localStorage.getItem(this.LAST_ACTIVITY_KEY));
    const lastActivityTime = Number.isFinite(lastActivity) && lastActivity > 0 ? lastActivity : Date.now();
    const remainingMs = this.IDLE_TIMEOUT_MS - (Date.now() - lastActivityTime);
    if (remainingMs <= 0) {
      this.logout('auth.idleTimeout');
      return;
    }
    this.idleTimeoutHandle = setTimeout(() => {
      this.logout('auth.idleTimeout');
    }, remainingMs);
  }

  private clearIdleTimeout(): void {
    if (this.idleTimeoutHandle) {
      clearTimeout(this.idleTimeoutHandle);
      this.idleTimeoutHandle = undefined;
    }
  }
}

import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthenticationControllerService, LoginResponse, LoginUserDto } from '../api';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly EXPIRATION_KEY = 'tokenExpiration';
  private readonly BACKEND_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
  private readonly MIN_TOKEN_LIFETIME_MS = 5 * 60 * 1000; // 5 minutes minimum
  private readonly authApiService = inject(AuthenticationControllerService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  // Signals for token and expiration
  readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  readonly expiration = signal<number | null>(
    (() => {
      const v = localStorage.getItem('tokenExpiration');
      return v ? Number(v) : null;
    })()
  );
  private backendTimeoutHandle?: ReturnType<typeof setTimeout>;

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

    this.setupUnloadListener();
    this.setupOnlineOfflineListeners();
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
          // Reset backend timeout on successful login
          this.resetBackendTimeout();
          this.router.navigate(['/']);
        }
      })
    );
  }

  logout(message?: string): void {
    if (message) {
      try {
        this.snackbar.show(message);
      } catch {}
    }
    this.clearExpirationTimeout();
    this.clearBackendTimeout();
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
    this.token.set(null);
    this.expiration.set(null);
    try {
      this.snackbar.show('Sitzung abgelaufen. Bitte erneut anmelden.');
    } catch {}
    this.router.navigate(['/login']);
  }

  private setupUnloadListener(): void {
    if (typeof window === 'undefined') return;
    
    // Only clear token on actual window unload, not on navigation
    // Use pagehide event which is more reliable than beforeunload
    window.addEventListener('pagehide', (event) => {
      // pagehide fires when page is being unloaded or hidden
      console.log('[AUTH] Page unload/hide event');
      this.token.set(null);
      this.expiration.set(null);
    });
  }

  private setupOnlineOfflineListeners(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('offline', () => {
      this.logout('Verbindung zum Server verloren. Bitte erneut anmelden.');
    });
  }

  /**
   * Reset backend timeout: starts 2-minute countdown to logout if backend doesn't respond
   */
  resetBackendTimeout(): void {
    this.clearBackendTimeout();
    this.backendTimeoutHandle = setTimeout(() => {
      this.logout('Backend antwortet nicht. Sitzung abgelaufen. Bitte erneut anmelden.');
    }, this.BACKEND_TIMEOUT_MS);
  }

  private clearBackendTimeout(): void {
    if (this.backendTimeoutHandle) {
      clearTimeout(this.backendTimeoutHandle);
      this.backendTimeoutHandle = undefined;
    }
  }
}

import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthenticationControllerService, LoginResponse, LoginUserDto } from '../api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly EXPIRATION_KEY = 'tokenExpiration';
  private readonly authApiService = inject(AuthenticationControllerService);
  private readonly router = inject(Router);

  // Signals for token and expiration
  readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  readonly expiration = signal<number | null>(
    (() => {
      const v = localStorage.getItem('tokenExpiration');
      return v ? Number(v) : null;
    })()
  );

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
        this.clearExpirationTimeout();
        return;
      }
      const ms = e - Date.now();
      if (ms <= 0) {
        this.handleTokenExpired();
        return;
      }
      this.clearExpirationTimeout();
      this.expirationTimeout = setTimeout(() => this.handleTokenExpired(), ms);
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
        if (response.token) {
          this.token.set(response.token);
          if (response.expiresIn) {
            this.expiration.set(Date.now() + response.expiresIn * 1000);
          }
          this.router.navigate(['/']);
        }
      })
    );
  }

  logout(message?: string): void {
    if (message) {
      try {
        alert(message);
      } catch {}
    }
    this.clearExpirationTimeout();
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
      alert('Sitzung abgelaufen. Bitte erneut anmelden.');
    } catch {}
    this.router.navigate(['/login']);
  }

  private setupUnloadListener(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('beforeunload', () => {
      // Remove token on browser/tab close
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
}

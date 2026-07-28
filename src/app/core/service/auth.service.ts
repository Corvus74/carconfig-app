import { Injectable, signal, inject } from '@angular/core';
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

  private readonly _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  constructor() {
    this._isLoggedIn.set(this.isTokenValid());
  }
  /**
   * Checks if token exists AND is not expired
   */
  private isTokenValid(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expirationStr = localStorage.getItem(this.EXPIRATION_KEY);
    if (!token || !expirationStr) {
      return false;
    }
    const expirationTime = Number(expirationStr);
    const isExpired = Date.now() >= expirationTime;
    if (isExpired) {
      this.clearStorage();
      return false;
    }
    return true;
  }
  getToken(): string | null {
    return this.isTokenValid() ? localStorage.getItem(this.TOKEN_KEY) : null;
  }
  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginUserDto = {
      email: email,
      password: password,
    };
    return this.authApiService.authenticate(loginRequest).pipe(
      tap((response: LoginResponse) => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          // Calculate exact expiration timestamp (assuming expiresIn is in seconds)
          if (response.expiresIn) {
            const expirationTime = Date.now() + response.expiresIn * 1000;
            localStorage.setItem(this.EXPIRATION_KEY, expirationTime.toString());
          }
          this._isLoggedIn.set(true);
          this.router.navigate(['/']);
        }
      })
    );
  }
  logout(): void {
    this.clearStorage();
    this._isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
  }
  }

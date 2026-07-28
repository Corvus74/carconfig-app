import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  // 1. Request klonen & Token hinzufügen (falls vorhanden)
  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  // 2. Request absenden & globale 401 Fehlerbehandlung hinzufügen
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Wenn das Backend 401 Unauthorized zurückgibt -> Automatisch ausloggen
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  return next(authReq).pipe(
    tap(() => {
      // Reset backend timeout on successful response
      if (authToken) {
        authService.resetBackendTimeout();
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout('Sitzung abgelaufen oder nicht autorisiert. Bitte erneut anmelden.');
      }
      return throwError(() => error);
    })
  );
};

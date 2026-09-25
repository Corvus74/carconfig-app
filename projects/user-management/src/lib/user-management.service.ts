import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpUserRequestDto, SignUpUserResponseDto } from '@carconfig/api-client';
import { RUNTIME_CONFIG } from '@carconfig/shared';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(RUNTIME_CONFIG);

  addUser(signupKey: string, user: SignUpUserRequestDto): Observable<SignUpUserResponseDto> {
    const headers = new HttpHeaders({ 'X-Signup-Key': signupKey });
    return this.http.post<SignUpUserResponseDto>(
      `${this.config.apiBaseUrl}/auth/signup`,
      user,
      { headers },
    );
  }
}

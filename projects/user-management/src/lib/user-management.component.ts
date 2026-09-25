import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { UserManagementService } from './user-management.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslocoModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userManagementService = inject(UserManagementService);

  readonly signupKey = this.formBuilder.nonNullable.control('', Validators.required);
  readonly userForm = this.formBuilder.nonNullable.group({
    userName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  readonly isSubmitting = signal(false);
  readonly feedback = signal<{ kind: 'success' | 'error'; message: string; params?: Record<string, string> } | null>(null);

  get canEnterUserData(): boolean {
    return this.signupKey.value.trim().length > 0;
  }

  addUser(): void {
    this.feedback.set(null);
    this.signupKey.markAsTouched();
    this.userForm.markAllAsTouched();
    if (this.signupKey.invalid || this.userForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.userManagementService.addUser(this.signupKey.value.trim(), this.userForm.getRawValue()).subscribe({
      next: (user) => {
        this.feedback.set({
          kind: 'success',
          message: 'users.created',
          params: { name: user.userName || user.email || '' },
        });
        this.userForm.reset();
        this.isSubmitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status === 401 || error.status === 403
          ? 'users.keyRejected'
          : error.status === 409
            ? 'users.emailExists'
            : 'users.createFailed';
        this.feedback.set({ kind: 'error', message });
        this.isSubmitting.set(false);
      },
    });
  }
}

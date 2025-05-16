/* src/app/auth/login.component.ts */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="form-container">
      <h1 class="form-title">Login</h1>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="form-field">
          <mat-form-field appearance="fill">
            <mat-label>Username or Email</mat-label>
            <input matInput type="text" formControlName="identifier" required>
            <mat-error *ngIf="loginForm.get('identifier')?.hasError('required')">
              Username or Email is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-field">
          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button type="submit" 
                  class="form-button primary"
                  [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </div>

        <div class="form-divider">
          <span>OR</span>
        </div>

        <div class="form-helper">
          Don't have an account? 
          <a routerLink="/register" class="form-link">Register here</a>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['../shared/styles/form.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { identifier, password } = this.loginForm.value;
      this.authService.login({ identifier, password }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
        }
      });
    }
  }
}

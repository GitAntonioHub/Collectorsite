/* src/app/auth/register.component.ts */
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    RouterLink,
    MatIconModule
  ],
  template: `
    <div class="form-container">
      <h1 class="form-title">Register</h1>
      
      <form [formGroup]="fg" (ngSubmit)="submit()" class="space-y-6">
        <div class="form-field">
          <mat-form-field appearance="fill">
            <mat-label>Username</mat-label>
            <input matInput type="text" formControlName="u" required>
            <mat-error *ngIf="fg.get('u')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-field">
          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="e" required>
            <mat-error *ngIf="fg.get('e')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="fg.get('e')?.hasError('email')">
              Please enter a valid email address
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-field">
          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="p" required>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="fg.get('p')?.hasError('required')">
              Password is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-field">
          <mat-form-field appearance="fill">
            <mat-label>Confirm Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="r" required>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="fg.get('r')?.hasError('required')">
              Please confirm your password
            </mat-error>
            <mat-error *ngIf="mismatch">
              Passwords don't match
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button type="submit" 
                  class="form-button primary"
                  [disabled]="fg.invalid || mismatch">
            Register
          </button>
        </div>

        <div class="form-divider">
          <span>OR</span>
        </div>

        <div class="form-helper">
          Already registered? 
          <a routerLink="/login" class="form-link">Login here</a>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['../shared/styles/form.scss']
})
export class RegisterComponent {
  fg: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.fg = this.fb.group({
      u: ['', Validators.required],
      e: ['', [Validators.required, Validators.email]],
      p: ['', Validators.required],
      r: ['', Validators.required]
    });
  }

  get mismatch() {
    return this.fg.value.p !== this.fg.value.r;
  }

  submit() {
    if (this.fg.invalid || this.mismatch) return;
    const { u, e, p } = this.fg.value;
    this.auth.register(u, e, p).subscribe(() => this.router.navigateByUrl('/'));
  }
}

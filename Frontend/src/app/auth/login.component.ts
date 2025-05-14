/* src/app/auth/login.component.ts */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  template:`
    <div class=\"flex justify-center items-center h-[calc(100vh-160px)]\">
      <form [formGroup]=\"fg\" (ngSubmit)=\"submit()\" class=\"w-72 space-y-5\">
        <mat-form-field appearance=\"fill\" class=\"w-full\">
          <mat-label>Username</mat-label>
          <input matInput formControlName=\"u\" required>
        </mat-form-field>

        <mat-form-field appearance=\"fill\" class=\"w-full\">
          <mat-label>Password</mat-label>
          <input matInput type=\"password\" formControlName=\"p\" required>
        </mat-form-field>

        <button mat-raised-button color=\"primary\" class=\"w-full\" [disabled]=\"fg.invalid\">Login</button>

        <p class=\"text-xs text-center\">No account?
          <a routerLink=\"/register\" class=\"underline\">Register</a></p>
      </form>
    </div>`
})
export class LoginComponent {
  fg: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.fg = this.fb.group({
      u: ['', Validators.required],
      p: ['', Validators.required]
    });
  }

  submit() {
    if (this.fg.invalid) return;
    const { u, p } = this.fg.value;
    this.auth.login(u, p).subscribe(() => this.router.navigateByUrl('/'));
  }
}

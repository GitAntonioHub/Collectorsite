/* src/app/auth/register.component.ts */
import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  template:`
  <div class=\"flex justify-center items-center h-[calc(100vh-160px)]\">
    <form [formGroup]=\"fg\" (ngSubmit)=\"submit()\" class=\"w-80 space-y-5\">

      <mat-form-field appearance=\"fill\" class=\"w-full\">
        <mat-label>Username</mat-label>
        <input matInput formControlName=\"u\" required>
      </mat-form-field>

      <mat-form-field appearance=\"fill\" class=\"w-full\">
        <mat-label>Email</mat-label>
        <input matInput type=\"email\" formControlName=\"e\" required>
      </mat-form-field>

      <mat-form-field appearance=\"fill\" class=\"w-full\">
        <mat-label>Password</mat-label>
        <input matInput type=\"password\" formControlName=\"p\" required>
      </mat-form-field>

      <mat-form-field appearance=\"fill\" class=\"w-full\">
        <mat-label>Repeat password</mat-label>
        <input matInput type=\"password\" formControlName=\"r\" required>
      </mat-form-field>

      <button mat-raised-button color=\"primary\" class=\"w-full\" [disabled]=\"fg.invalid || mismatch\">
        Register
      </button>

      <p *ngIf=\"mismatch\" class=\"text-xs text-red-400 text-center\">Passwords don’t match</p>

      <p class=\"text-xs text-center\">Already registered?
        <a routerLink=\"/login\" class=\"underline\">Login</a></p>
    </form>
  </div>`
})
export class RegisterComponent {
  fg: FormGroup;

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

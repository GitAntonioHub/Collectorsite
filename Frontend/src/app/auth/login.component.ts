import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api.service';          // << path is up ONE level
import { AuthStore } from '../core/state/auth.store';       // << path fixed
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  template: `
    <div class="flex justify-center items-center h-[calc(100vh-64px)]">
      <form (ngSubmit)="login()" class="w-72 space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="username" name="u" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Password</mat-label>
          <input matInput type="password" [(ngModel)]="password" name="p" required>
        </mat-form-field>

        <button mat-raised-button color="primary" class="w-full">Login</button>
      </form>
    </div>`
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private api: ApiService,
    private auth: AuthStore,
    private router: Router
  ) {}

  login() {
    this.api.post<{ token: string }>('/auth/login', {
      username: this.username,
      password: this.password
    }).subscribe(res => {
      this.auth.setToken(res.token);
      this.router.navigateByUrl('/');
    });
  }
}

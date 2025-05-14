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
  template: ` … same HTML as before … `
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

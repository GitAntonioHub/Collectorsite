/* src/app/auth/register.component.ts */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: ` … same HTML … `
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

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../core/state/auth.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-4xl font-bold text-center mb-8 text-white font-retrofuture uppercase tracking-wider">Profile Settings</h1>
      
      <div class="form-container max-w-2xl">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Profile Picture -->
          <div class="text-center mb-8">
            <div class="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-white overflow-hidden bg-black/30">
              <img [src]="profileImage || 'assets/default-avatar.png'" 
                   alt="Profile picture" 
                   class="w-full h-full object-cover">
            </div>
            <button type="button" 
                    class="form-button secondary"
                    (click)="fileInput.click()">
              <mat-icon class="mr-2">photo_camera</mat-icon>
              Change Picture
            </button>
            <input #fileInput
                   type="file" 
                   accept="image/*" 
                   class="hidden" 
                   (change)="onImageSelected($event)">
          </div>

          <!-- Display Name -->
          <div class="form-field">
            <mat-form-field appearance="fill">
              <mat-label>Display Name</mat-label>
              <input matInput formControlName="displayName" required>
              <mat-error *ngIf="profileForm.get('displayName')?.hasError('required')">
                Display name is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Email -->
          <div class="form-field">
            <mat-form-field appearance="fill">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Bio -->
          <div class="form-field">
            <mat-form-field appearance="fill">
              <mat-label>Bio</mat-label>
              <textarea matInput 
                        formControlName="bio" 
                        rows="4"
                        placeholder="Tell us about yourself..."></textarea>
              <mat-hint align="end">{{profileForm.get('bio')?.value?.length || 0}}/500</mat-hint>
            </mat-form-field>
          </div>

          <!-- Submit Button -->
          <div class="form-actions space-between">
            <button type="button" 
                    class="form-button secondary"
                    (click)="resetForm()">
              Reset
            </button>
            <button type="submit" 
                    class="form-button primary"
                    [disabled]="!profileForm.valid || !profileForm.dirty">
              <mat-icon class="mr-2">save</mat-icon>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['../shared/styles/form.scss']
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthStore);

  profileForm: FormGroup;
  profileImage: string | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(500)]]
    });

    // Load user data
    this.loadUserData();
  }

  loadUserData() {
    // TODO: Implement loading user data from backend
    const userData = {
      displayName: 'John Doe',
      email: 'john@example.com',
      bio: 'Collector of rare items'
    };
    this.profileForm.patchValue(userData);
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
        this.profileForm.markAsDirty();
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm() {
    this.loadUserData();
    this.profileImage = null;
    this.profileForm.markAsPristine();
  }

  onSubmit() {
    if (this.profileForm.valid && this.profileForm.dirty) {
      console.log('Form data:', this.profileForm.value);
      console.log('Profile image:', this.profileImage);
      // TODO: Implement profile update logic
      this.profileForm.markAsPristine();
    }
  }
} 
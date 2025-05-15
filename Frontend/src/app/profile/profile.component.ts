import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../core/state/auth.store';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto bg-black/50 border-2 border-white p-8">
        <h1 class="text-3xl mb-8 text-center">Profile Settings</h1>
        
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Profile Picture -->
          <div class="text-center mb-8">
            <div class="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-white overflow-hidden">
              <img [src]="profileImage || 'assets/default-avatar.png'" 
                   alt="Profile picture" 
                   class="w-full h-full object-cover">
            </div>
            <label class="retro-btn cursor-pointer inline-block">
              <input type="file" 
                     accept="image/*" 
                     class="hidden" 
                     (change)="onImageSelected($event)">
              Change Picture
            </label>
          </div>

          <!-- Display Name -->
          <div class="form-group">
            <label class="block mb-2">Display Name</label>
            <input type="text" 
                   formControlName="displayName"
                   class="w-full bg-black border-2 border-white p-2 text-white">
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="block mb-2">Email</label>
            <input type="email" 
                   formControlName="email"
                   class="w-full bg-black border-2 border-white p-2 text-white">
          </div>

          <!-- Bio -->
          <div class="form-group">
            <label class="block mb-2">Bio</label>
            <textarea formControlName="bio"
                      rows="4"
                      class="w-full bg-black border-2 border-white p-2 text-white"></textarea>
          </div>

          <!-- Submit Button -->
          <div class="text-center">
            <button type="submit" 
                    class="retro-btn"
                    [disabled]="!profileForm.valid || !profileForm.dirty">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `
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
      bio: ['']
    });

    // Load user data
    // this.loadUserData();
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      // Implement profile update logic
    }
  }
} 
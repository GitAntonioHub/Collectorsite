import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl mb-4">Settings</h1>
      <!-- Settings content will go here -->
    </div>
  `
})
export class SettingsComponent {
  settingsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      emailNotifications: [true],
      tradeAlerts: [true],
      profileVisible: [true],
      showOnline: [true],
      theme: ['default']
    });
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      console.log(this.settingsForm.value);
      // Implement settings update logic
    }
  }
} 
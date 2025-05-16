import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
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
    <div class="form-container">
      <h2 class="form-title">Make Trade Offer</h2>
      
      <form [formGroup]="fg" (ngSubmit)="propose()" class="space-y-6">
        <div class="form-field">
          <mat-form-field appearance="fill">
            <mat-label>Item to Request</mat-label>
            <input matInput formControlName="requestedItemId" required>
            <mat-error *ngIf="fg.get('requestedItemId')?.hasError('required')">
              Please select an item to request
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-field">
          <mat-form-field appearance="fill">
            <mat-label>Cash Adjustment</mat-label>
            <input matInput formControlName="cash" type="number">
            <span matPrefix>$&nbsp;</span>
            <mat-hint>Optional cash adjustment for the trade</mat-hint>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button type="submit" 
                  class="form-button primary"
                  [disabled]="fg.invalid">
            Send Offer
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['../shared/styles/form.scss']
})
export class TradeOffersComponent {
  fg: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.fg = this.fb.group({
      requestedItemId: ['', Validators.required],
      cash: [0]
    });
  }

  propose() {
    if (this.fg.invalid) return;
    this.api.post('/trade/propose', this.fg.value).subscribe(() => {
      alert('Offer sent');
      this.fg.reset();
    });
  }
}

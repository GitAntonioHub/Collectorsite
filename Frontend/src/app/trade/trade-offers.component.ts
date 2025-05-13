import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <section class="p-6 max-w-lg">
    <form [formGroup]="fg" (ngSubmit)="propose()" class="space-y-4">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Item to request</mat-label>
        <input matInput formControlName="requestedItemId">
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Cash adjustment</mat-label>
        <input matInput formControlName="cash" type="number">
      </mat-form-field>

      <button mat-raised-button color="primary" class="w-full">Send offer</button>
    </form>
  </section>
  `
})
export class TradeOffersComponent {
  fg: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.fg = this.fb.group({
      requestedItemId: [''],
      cash: [0]
    });
  }

  propose() {
    this.api.post('/trade/propose', this.fg.value).subscribe(() => {
      alert('Offer sent');
      this.fg.reset();
    });
  }
}

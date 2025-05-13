import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface ItemDTO {
  id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-my-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <section class="p-6 max-w-xl mx-auto">
    <form [formGroup]="fg" (ngSubmit)="create()" class="space-y-4">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title">
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Description</mat-label>
        <textarea matInput rows="3" formControlName="description"></textarea>
      </mat-form-field>

      <button mat-raised-button type="submit" color="primary" class="w-full">Create item</button>
    </form>

    <h2 class="mt-10 font-semibold">My items</h2>
    <ul class="mt-2 list-disc pl-5">
      <li *ngFor="let i of items">{{ i.title }}</li>
    </ul>
  </section>
  `
})
export class MyItemsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  fg: FormGroup = this.fb.group({
    title: [''],
    description: ['']
  });

  items: ItemDTO[] = [];

  ngOnInit() {
    this.load();
  }

  create() {
    this.api.post<ItemDTO>('/items', this.fg.value)
      .subscribe(() => {
        this.fg.reset();
        this.load();
      });
  }

  load() {
    this.api.get<ItemDTO[]>('/items')   // add a backend endpoint if needed
      .subscribe(res => this.items = res);
  }
}

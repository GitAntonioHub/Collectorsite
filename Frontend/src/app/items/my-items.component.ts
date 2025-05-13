import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ItemDetailComponent } from './item-detail.component';
import { ItemDTO } from './models';

@Component({
  selector: 'app-my-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, ItemDetailComponent],
  template: `
    <section class="p-6 grid lg:grid-cols-2 gap-10">
      <!-- create form -->
      <form [formGroup]="fg" (ngSubmit)="create()" class="space-y-4">
        <!-- title + description inputs … -->
      </form>

      <!-- detail / upload pane -->
      <ng-container *ngIf="selected">
        <item-detail
          [itemId]="selected.id"
          [title]="selected.title"
          [description]="selected.description">
        </item-detail>
      </ng-container>
    </section>
  `
})
export class MyItemsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  selected?: ItemDTO;

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

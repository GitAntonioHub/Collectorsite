import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ItemDetailComponent } from './item-detail.component';
import { ItemDTO } from './models';
import { ItemService } from './item.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-items',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    ItemDetailComponent,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-white font-retrofuture uppercase tracking-wider">My Items</h1>
        <button class="form-button primary" (click)="showAddItemForm = true">
          <mat-icon>add</mat-icon> Add New Item
        </button>
      </div>

      <!-- Add Item Form Dialog -->
      <div *ngIf="showAddItemForm" class="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
        <div class="bg-black border-2 border-white p-8 max-w-md w-full">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white font-retrofuture uppercase">Add New Item</h2>
            <button class="text-white hover:text-cyan-400" (click)="showAddItemForm = false">×</button>
          </div>
          
          <form [formGroup]="fg" (ngSubmit)="create()" class="space-y-6">
            <div class="form-field">
              <mat-form-field appearance="fill">
                <mat-label>Title</mat-label>
                <input matInput type="text" formControlName="title" required>
                <mat-error *ngIf="fg.get('title')?.hasError('required')">
                  Title is required
                </mat-error>
                <mat-error *ngIf="fg.get('title')?.hasError('minlength')">
                  Title must be at least 3 characters
                </mat-error>
                <mat-error *ngIf="fg.get('title')?.hasError('maxlength')">
                  Title cannot exceed 150 characters
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-field">
              <mat-form-field appearance="fill">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="4" required></textarea>
                <mat-error *ngIf="fg.get('description')?.hasError('required')">
                  Description is required
                </mat-error>
                <mat-error *ngIf="fg.get('description')?.hasError('minlength')">
                  Description must be at least 10 characters
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-field">
              <mat-form-field appearance="fill">
                <mat-label>Year</mat-label>
                <input matInput type="number" formControlName="year">
                <mat-error *ngIf="fg.get('year')?.hasError('min')">
                  Year must be 1800 or later
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-field">
              <mat-form-field appearance="fill">
                <mat-label>Estimated Value</mat-label>
                <input matInput type="number" formControlName="estimatedValue">
                <span matPrefix>$&nbsp;</span>
                <mat-error *ngIf="fg.get('estimatedValue')?.hasError('min')">
                  Value must be positive
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button type="submit" 
                      class="form-button primary w-full"
                      [disabled]="fg.invalid || isSubmitting">
                {{ isSubmitting ? 'Adding...' : 'Add Item' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="col-span-full text-center py-12">
          <p class="text-white text-xl font-retrofuture">Loading items...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="col-span-full text-center py-12">
          <p class="text-red-500 text-xl font-retrofuture">{{ error }}</p>
          <button (click)="load()" class="mt-4 text-white hover:text-cyan-400">Try Again</button>
        </div>
        
        <!-- Empty State -->
        <div *ngIf="!isLoading && !error && items.length === 0" class="col-span-full text-center py-12">
          <p class="text-white text-xl font-retrofuture">No items in your collection yet</p>
          <p class="text-white/70 mt-2">Add your first item using the button above</p>
        </div>

        <!-- Items -->
        <div *ngFor="let item of items" 
             class="bg-black/30 border-2 border-white p-4 hover:bg-black/50 transition-all">
          <div class="aspect-square mb-4 bg-black/30 border-2 border-white overflow-hidden cursor-pointer"
               (click)="selectItem(item)">
            <!-- Image placeholder or first item image -->
            <div class="w-full h-full flex items-center justify-center text-white/50 font-retrofuture">
              Item Image
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-white mb-2 font-retrofuture uppercase">{{ item.title }}</h3>
          
          <div class="flex justify-between items-center mb-4">
            <span class="text-white text-sm font-retrofuture">
              {{ item.year }}
            </span>
            <span class="text-white/70 text-sm font-retrofuture uppercase px-3 py-1 border border-white rounded">
              {{ item.status }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2">
            <button class="form-button secondary w-full text-sm" (click)="selectItem(item)">
              <mat-icon>edit</mat-icon> Edit Details
            </button>
            <button *ngIf="item.status === 'DRAFT'" 
                    class="form-button primary w-full text-sm"
                    (click)="makeListable(item)">
              <mat-icon>store</mat-icon> Make Tradable
            </button>
          </div>
        </div>
      </div>

      <!-- Selected Item Detail -->
      <div *ngIf="selected" class="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
        <div class="bg-black border-2 border-white p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white font-retrofuture uppercase">Item Details</h2>
            <button class="text-white hover:text-cyan-400" (click)="selected = undefined">×</button>
          </div>

          <item-detail
            [itemId]="selected.id"
            [title]="selected.title"
            [description]="selected.description">
          </item-detail>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../shared/styles/form.scss']
})
export class MyItemsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private itemSvc = inject(ItemService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  selected?: ItemDTO;
  items: ItemDTO[] = [];
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  showAddItemForm = false;

  fg: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    year: [null, [Validators.min(1800)]],
    estimatedValue: [null, [Validators.min(0)]]
  });

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.isLoading = true;
    this.error = null;
    this.itemSvc.myItems().subscribe({
      next: (items) => {
        this.items = items;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  create() {
    if (this.fg.invalid) return;
    
    this.isSubmitting = true;
    this.itemSvc.create(this.fg.value).subscribe({
      next: () => {
        this.load();
        this.fg.reset();
        this.isSubmitting = false;
        this.showAddItemForm = false;
        this.snackBar.open('Item added successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackBar.open(err.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  selectItem(item: ItemDTO) {
    this.selected = item;
  }

  makeListable(item: ItemDTO) {
    this.itemSvc.makeListable(item.id).subscribe({
      next: () => {
        this.load();
        this.snackBar.open('Item is now tradable', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}

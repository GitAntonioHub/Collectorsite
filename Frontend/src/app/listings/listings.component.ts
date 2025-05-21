import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../core/api.service';
import { ListingDTO } from './models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { ListingService } from './listing.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Page } from '../shared/page.model';

@Component({
  standalone: true,
  selector: 'app-listings',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatPaginatorModule, 
    MatTableModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-4xl font-bold text-center mb-8 text-white font-retrofuture uppercase tracking-wider">Browse Items</h1>
      
      <!-- Search and Filters -->
      <div class="flex items-center gap-4 mb-8">
        <div class="flex-1 relative">
          <mat-form-field appearance="fill" class="w-full">
              <mat-label>Search Items</mat-label>
              <input matInput [formControl]="q" placeholder="Search by title...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          
            <mat-form-field appearance="fill">
              <mat-label>Sort By</mat-label>
              <mat-select [formControl]="sortBy">
                <mat-option value="price_asc">Price: Low to High</mat-option>
                <mat-option value="price_desc">Price: High to Low</mat-option>
                <mat-option value="newest">Newest First</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Type</mat-label>
              <mat-select [formControl]="listingType">
                <mat-option value="all">All</mat-option>
                <mat-option value="SALE">For Sale</mat-option>
                <mat-option value="AUCTION">Auction</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-12">
        <mat-spinner [diameter]="40"></mat-spinner>
      </div>

      <!-- Grid of Listings -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let listing of listings" 
             class="bg-black/50 border-2 border-white overflow-hidden cursor-pointer hover:bg-black/70 transition-all"
             (click)="viewListing(listing)">
          <div class="aspect-square bg-black/30 border-b-2 border-white overflow-hidden">
            <ng-container *ngIf="listing.images && listing.images.length > 0 && listing.images[0].url; else noImage">
              <img [src]="listing.images[0].url" 
                   [alt]="listing.title" 
                   class="w-full h-full object-cover"/>
            </ng-container>
            <ng-template #noImage>
            <div class="w-full h-full flex items-center justify-center text-white/50 font-retrofuture">
                No Image
            </div>
            </ng-template>
          </div>
          
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white font-retrofuture">{{listing.title}}</h3>
              <span class="text-sm text-white/70">{{listing.condition || 'Not specified'}}</span>
            </div>
            <p class="text-white/90 mb-2 line-clamp-2">{{listing.description || 'No description available'}}</p>
          <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <span class="text-cyan-400 font-bold">{{listing.price | currency:listing.currency}}</span>
                <ng-container *ngIf="listing.estimatedValue">
                  <span class="text-sm text-white/70">
                    Est. Value: {{listing.estimatedValue | currency:listing.currency}}
            </span>
                </ng-container>
              </div>
              <span class="text-white/70 text-sm border border-white/70 px-2 py-1 rounded">
                {{listing.listingType}}
            </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && listings.length === 0" class="text-center py-12">
        <p class="text-white text-xl font-retrofuture">No items found</p>
      </div>

      <!-- Pagination -->
      <div *ngIf="!isLoading && totalPages > 1" class="mt-8 flex justify-center">
        <mat-paginator 
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageSizeOptions]="[12,24,48]"
          [showFirstLastButtons]="true"
          class="retro-paginator"
          (page)="onPageChange($event)">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .font-retrofuture {
      font-family: 'RetroFuture', sans-serif !important;
    }
    ::ng-deep .retro-paginator {
      background: transparent !important;
    }
    ::ng-deep .mat-mdc-form-field {
      @apply bg-black/50 border-2 border-white rounded-lg;
    }
    ::ng-deep .mat-mdc-text-field-wrapper {
      background: transparent !important;
    }
    ::ng-deep .mat-mdc-form-field-focus-overlay {
      background: transparent !important;
    }
    ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
      background: transparent !important;
    }
    ::ng-deep .mat-mdc-form-field .mat-mdc-form-field-flex {
      background: transparent !important;
    }
    ::ng-deep .mdc-text-field {
      @apply rounded-t-lg;
    }
    ::ng-deep .mat-mdc-form-field-infix {
      @apply text-white;
    }
    ::ng-deep .mdc-floating-label, ::ng-deep .mat-mdc-select-value, ::ng-deep .mat-mdc-select-arrow {
      @apply text-white !important;
    }
    ::ng-deep .mdc-line-ripple::before, ::ng-deep .mdc-line-ripple::after {
      border-bottom-color: white !important;
    }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    ::ng-deep .mat-mdc-progress-spinner {
      --mdc-circular-progress-active-indicator-color: white;
    }
  `]
})
export class ListingsComponent implements OnInit {
  private listSvc = inject(ListingService);
  private router = inject(Router);

  listings: ListingDTO[] = [];
  isLoading = false;
  totalElements = 0;
  totalPages = 0;
  pageSize = 12;
  
  // Form controls
  q = new FormControl('');
  sortBy = new FormControl('newest');
  listingType = new FormControl('all');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadListings();

    // Subscribe to filter changes
    merge(
      this.q.valueChanges,
      this.sortBy.valueChanges,
      this.listingType.valueChanges
    ).pipe(
      startWith(null)
    ).subscribe(() => {
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
      this.loadListings();
    });
  }

  loadListings() {
    this.isLoading = true;
    this.listSvc.browse(
      this.q.value ?? '',
      this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? this.pageSize
    ).subscribe({
      next: (page: Page<ListingDTO>) => {
        this.listings = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading listings:', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.loadListings();
  }

  viewListing(listing: ListingDTO) {
    this.router.navigate(['/listings', listing.id]);
  }
}
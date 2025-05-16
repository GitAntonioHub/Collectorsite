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

interface Page<T> {
  content: T[];
  totalElements: number;
}

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
    MatIconModule
  ],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-4xl font-bold text-center mb-8 text-white font-retrofuture uppercase tracking-wider">Browse Items</h1>
      
      <!-- Search and Filters -->
      <div class="form-container mb-8">
        <div class="form-grid">
          <!-- Search Input -->
          <div class="form-field">
            <mat-form-field appearance="fill">
              <mat-label>Search Items</mat-label>
              <input matInput [formControl]="q" placeholder="Search by title...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          
          <!-- Sort Dropdown -->
          <div class="form-field">
            <mat-form-field appearance="fill">
              <mat-label>Sort By</mat-label>
              <mat-select [formControl]="sortBy">
                <mat-option value="price_asc">Price: Low to High</mat-option>
                <mat-option value="price_desc">Price: High to Low</mat-option>
                <mat-option value="newest">Newest First</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Type Filter -->
          <div class="form-field">
            <mat-form-field appearance="fill">
              <mat-label>Type</mat-label>
              <mat-select [formControl]="listingType">
                <mat-option value="all">All</mat-option>
                <mat-option value="SALE">For Sale</mat-option>
                <mat-option value="AUCTION">Auction</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>
      </div>

      <!-- Grid of Listings -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let listing of data.data" 
             class="listing-card bg-black/50 border-2 border-white p-4 cursor-pointer hover:bg-black/70 transition-all"
             (click)="viewListing(listing)">
          <div class="aspect-square mb-4 bg-black/30 border-2 border-white overflow-hidden">
            <!-- Image placeholder - replace with actual image -->
            <div class="w-full h-full flex items-center justify-center text-white/50 font-retrofuture">
              Item Image
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-white mb-2 font-retrofuture uppercase">{{ listing.title }}</h3>
          
          <div class="flex justify-between items-center">
            <span class="text-white text-lg font-retrofuture">
              {{ listing.price | currency:listing.currency }}
            </span>
            <span class="listing-type text-white text-sm font-retrofuture uppercase px-3 py-1 border border-white rounded">
              {{ listing.listingType }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="data.data.length === 0" class="text-center py-12">
        <p class="text-white text-xl font-retrofuture">No items found</p>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center">
        <mat-paginator 
          [length]="total"
          [pageSize]="12"
          [pageSizeOptions]="[12,24,48]"
          [showFirstLastButtons]="true"
          class="retro-paginator">
        </mat-paginator>
      </div>
    </div>
  `,
  styleUrls: ['../shared/styles/form.scss']
})
export class ListingsComponent implements OnInit {
  private listSvc = inject(ListingService);
  private router = inject(Router);

  data = new MatTableDataSource<ListingDTO>([]);
  total = 0;
  
  // Form controls
  q = new FormControl('');
  sortBy = new FormControl('newest');
  listingType = new FormControl('all');

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    // Combine all filter changes
    merge(
      this.q.valueChanges,
      this.sortBy.valueChanges,
      this.listingType.valueChanges,
      this.paginator.page
    ).pipe(
      startWith(''),
      switchMap(() => this.listSvc.feed(
        this.q.value ?? '', 
        this.paginator.pageIndex, 
        this.paginator.pageSize
      ))
    ).subscribe(res => {
      this.data.data = res.content;
      this.total = res.totalElements;
    });
  }

  viewListing(listing: ListingDTO) {
    this.router.navigate(['/listings', listing.id]);
  }
}
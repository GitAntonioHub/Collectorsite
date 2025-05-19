import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from './item.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Listing {
  id: string;
  itemId: string;
  listingType: 'SALE' | 'AUCTION';
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  // Item details
  title: string;
  description: string;
  imageUrl: string | null;
  condition: string;
  year: number | null;
  estimatedValue: number | null;
  category?: string;
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center gap-4 mb-8">
        <div class="flex-1 relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Search items..."
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <mat-icon class="absolute right-3 top-2.5 text-gray-400">search</mat-icon>
        </div>
        
        <button
          (click)="toggleFilters()"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <mat-icon class="mr-2">filter_list</mat-icon>
          Filters
        </button>
      </div>

      <!-- Filters panel -->
      <div *ngIf="showFilters" class="mb-8 p-4 bg-gray-50 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              [(ngModel)]="filters.category"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category">
                {{category}}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div class="flex gap-2">
              <input
                type="number"
                [(ngModel)]="filters.minPrice"
                (change)="applyFilters()"
                placeholder="Min"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                [(ngModel)]="filters.maxPrice"
                (change)="applyFilters()"
                placeholder="Max"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              [(ngModel)]="filters.sortBy"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Items grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let listing of listings" 
             class="bg-black/50 border-2 border-white overflow-hidden cursor-pointer hover:bg-black/70 transition-all"
             (click)="viewDetails(listing)">
          <div class="aspect-square bg-black/30 border-b-2 border-white overflow-hidden">
            <img [src]="listing.imageUrl || 'assets/placeholder.jpg'" 
                 [alt]="listing.title" 
                 class="w-full h-full object-cover"/>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white font-retrofuture">{{listing.title}}</h3>
              <span class="text-sm text-white/70">{{listing.condition}}</span>
            </div>
            <p class="text-white/90 mb-2 line-clamp-2">{{listing.description}}</p>
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <span class="text-cyan-400 font-bold">{{listing.price | currency:listing.currency}}</span>
                <span class="text-sm text-white/70" *ngIf="listing.estimatedValue">
                  Est. Value: {{listing.estimatedValue | currency:listing.currency}}
                </span>
              </div>
              <span class="text-white/70 text-sm border border-white/70 px-2 py-1 rounded">
                {{listing.listingType}}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="listings.length === 0" class="text-center py-12">
        <p class="text-white text-xl font-retrofuture">No items found</p>
      </div>

      <!-- Pagination -->
      <div *ngIf="totalPages > 1" class="mt-8 flex justify-center gap-2">
        <button
          *ngFor="let page of getPageNumbers()"
          (click)="goToPage(page)"
          [class.bg-cyan-500]="currentPage === page"
          [class.text-white]="currentPage === page"
          [class.border-cyan-500]="currentPage === page"
          class="px-3 py-1 rounded border-2 border-white text-white hover:bg-black/50"
        >
          {{page + 1}}
        </button>
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
  `]
})
export class BrowseComponent implements OnInit {
  listings: Listing[] = [];
  searchQuery: string = '';
  showFilters: boolean = false;
  categories: string[] = ['Electronics', 'Clothing', 'Books', 'Sports', 'Other'];
  currentPage: number = 0;
  pageSize: number = 12;
  totalPages: number = 0;
  
  filters = {
    category: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    sortBy: 'newest'
  };

  constructor(
    private itemService: ItemService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.itemService.getItems(this.searchQuery, this.currentPage, this.pageSize).subscribe(response => {
      this.listings = response.content;
      this.totalPages = response.totalPages;
      this.applyFilters();
    });
  }

  onSearch() {
    this.currentPage = 0;
    this.loadItems();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    let filtered = [...this.listings];

    // Apply category filter
    if (this.filters.category) {
      filtered = filtered.filter(item => item.category === this.filters.category);
    }

    // Apply price range filter
    if (this.filters.minPrice !== null) {
      filtered = filtered.filter(item => item.price >= this.filters.minPrice!);
    }
    if (this.filters.maxPrice !== null) {
      filtered = filtered.filter(item => item.price <= this.filters.maxPrice!);
    }

    // Apply sorting
    switch (this.filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'priceAsc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    this.listings = filtered;
  }

  viewDetails(listing: Listing) {
    this.router.navigate(['/items', listing.itemId]);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadItems();
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
} 
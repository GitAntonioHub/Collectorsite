import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../items/item.service';
import { ItemDTO, ItemStatus } from '../items/models';
import { Page } from '../shared/page.model';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Search and Sort Controls -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div class="w-full md:w-1/2">
          <input
            type="text"
            [ngModel]="searchTerm.value"
            (ngModelChange)="searchTerm.next($event)"
            placeholder="Search available items..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="w-full md:w-auto">
          <select
            [ngModel]="sortOption.value"
            (ngModelChange)="sortOption.next($event)"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading.value) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (item of [1,2,3,4,5,6,8,9,10,11,12]; track item) {
            <div class="bg-gray-100 rounded-lg p-4 h-64 animate-pulse">
              <div class="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          }
        </div>
      }

      <!-- Items Grid -->
      @if (!isLoading.value && availableItems.value?.content?.length) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (item of getItemsContent(); track item.id) {
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                 (click)="viewItemDetails(item)">
              @if (item.images && item.images.length > 0 && item.images[0] && item.images[0].url) {
                <img [src]="item.images[0].url" [alt]="item.title" class="w-full h-48 object-cover"/>
              } @else {
                <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-400">No image</span>
                </div>
              }
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 truncate">{{ item.title }}</h3>
                <p class="text-gray-600 mb-2" *ngIf="item.estimatedValue">{{ item.estimatedValue | currency }}</p>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">{{ item.condition || 'Condition N/A' }}</span>
                  <span class="text-sm text-gray-500">{{ item.year || 'Year N/A' }}</span>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Load More Button -->
        @if (!isLastPage()) {
          <div class="text-center mt-8">
            <button
              (click)="loadMore()"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Load More
            </button>
          </div>
        }
      }

      <!-- Empty State -->
      @if (!isLoading.value && !availableItems.value?.content?.length) {
        <div class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No available items found</h3>
          <p class="text-gray-500">Try adjusting your search criteria</p>
        </div>
      }
    </div>
  `
})
export class ListingsComponent implements OnInit {
  private itemService = inject(ItemService);
  private api = inject(ApiService);
  private router = inject(Router);
  
  // State
  searchTerm = new BehaviorSubject<string>('');
  sortOption = new BehaviorSubject<string>('newest');
  currentPage = new BehaviorSubject<number>(0);
  isLoading = new BehaviorSubject<boolean>(true);
  availableItems = new BehaviorSubject<Page<ItemDTO> | null>(null);

  ngOnInit() {
    // Combine search, sort and page changes
    combineLatest([
      this.searchTerm.pipe(debounceTime(300), distinctUntilChanged()),
      this.sortOption,
      this.currentPage
    ]).pipe(
      switchMap(([search, sort, page]) => {
        this.isLoading.next(true);
        return this.fetchAvailableItems(search, page, 12, sort);
      })
    ).subscribe({
      next: (response) => {
        if (this.currentPage.value === 0) {
          this.availableItems.next(response);
        } else {
          // Append new items for infinite scroll
          const currentItems = this.availableItems.value;
          if (currentItems) {
            this.availableItems.next({
              ...response,
              content: [...currentItems.content, ...response.content]
            });
          } else {
            this.availableItems.next(response);
          }
        }
        this.isLoading.next(false);
      },
      error: (error) => {
        console.error('Error fetching available items:', error);
        this.isLoading.next(false);
      }
    });
  }

  // Fetch available items using the API
  fetchAvailableItems(search: string = '', page: number = 0, size: number = 12, sort: string = 'newest') {
    const params = {
      q: search,
      page: page.toString(),
      size: size.toString(),
      sort: this.getSortParam(sort),
      status: 'AVAILABLE'
    };
    
    return this.api.get<Page<ItemDTO>>('/items/available', params);
  }

  getItemsContent(): ItemDTO[] {
    return this.availableItems.value?.content || [];
  }

  loadMore() {
    this.currentPage.next(this.currentPage.value + 1);
  }

  isLastPage(): boolean {
    const items = this.availableItems.value;
    return items ? items.last : true;
  }

  viewItemDetails(item: ItemDTO) {
    this.router.navigate(['/items', item.id]);
  }

  private getSortParam(sort: string): string {
    switch (sort) {
      case 'price_asc':
        return 'estimatedValue,asc';
      case 'price_desc':
        return 'estimatedValue,desc';
      case 'newest':
      default:
        return 'createdAt,desc';
    }
  }
}
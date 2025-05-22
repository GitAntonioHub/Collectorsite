import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingService } from './listing.service';
import { ListingDTO } from './models';
import { Page } from '../shared/page.model';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-browse',
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
            placeholder="Search listings..."
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

      <!-- Listings Grid -->
      @if (!isLoading.value && listings.value?.content?.length) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (listing of getListingsContent(); track listing.id) {
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              @if (listing.imageUrl) {
                <img [src]="listing.imageUrl" [alt]="listing.title" class="w-full h-48 object-cover"/>
              } @else {
                <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-400">No image</span>
                </div>
              }
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 truncate">{{ listing.title }}</h3>
                <p class="text-gray-600 mb-2">{{ listing.price | currency }}</p>
                @if (listing.owner.displayName) {
                  <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {{ listing.owner.displayName }}
                  </span>
                }
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
      @if (!isLoading.value && !listings.value?.content?.length) {
        <div class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No listings found</h3>
          <p class="text-gray-500">Try adjusting your search criteria</p>
        </div>
      }
    </div>
  `
})
export class BrowseComponent implements OnInit {
  private listingService = inject(ListingService);
  
  // State
  searchTerm = new BehaviorSubject<string>('');
  sortOption = new BehaviorSubject<string>('newest');
  currentPage = new BehaviorSubject<number>(0);
  isLoading = new BehaviorSubject<boolean>(true);
  listings = new BehaviorSubject<Page<ListingDTO> | null>(null);

  ngOnInit() {
    // Combine search, sort and page changes
    combineLatest([
      this.searchTerm.pipe(debounceTime(300), distinctUntilChanged()),
      this.sortOption,
      this.currentPage
    ]).pipe(
      switchMap(([search, sort, page]) => {
        this.isLoading.next(true);
        return this.listingService.feed(search, page, 12, sort);
      })
    ).subscribe({
      next: (response) => {
        if (this.currentPage.value === 0) {
          this.listings.next(response);
        } else {
          // Append new items for infinite scroll
          const currentListings = this.listings.value;
          if (currentListings) {
            this.listings.next({
              ...response,
              content: [...currentListings.content, ...response.content]
            });
          } else {
            this.listings.next(response);
          }
        }
        this.isLoading.next(false);
      },
      error: (error) => {
        console.error('Error fetching listings:', error);
        this.isLoading.next(false);
      }
    });
  }

  getListingsContent(): ListingDTO[] {
    return this.listings.value?.content || [];
  }

  loadMore() {
    this.currentPage.next(this.currentPage.value + 1);
  }

  isLastPage(): boolean {
    const listings = this.listings.value;
    return listings ? listings.last : true;
  }
} 
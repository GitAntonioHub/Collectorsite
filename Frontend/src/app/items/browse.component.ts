import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from './item.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ItemDTO } from './models';

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
      </div>

      <!-- Items grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let item of items" 
             class="bg-black/50 border-2 border-white overflow-hidden cursor-pointer hover:bg-black/70 transition-all"
             (click)="viewDetails(item)">
          <div class="aspect-square bg-black/30 border-b-2 border-white overflow-hidden">
            <img [src]="item.images?.[0]?.url || 'assets/placeholder.jpg'" 
                 [alt]="item.title" 
                 class="w-full h-full object-cover"/>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white font-retrofuture">{{item.title}}</h3>
              <span class="text-sm text-white/70">{{item.condition}}</span>
            </div>
            <p class="text-white/90 mb-2 line-clamp-2">{{item.description}}</p>
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <span class="text-cyan-400 font-bold" *ngIf="item.estimatedValue">
                  Est. Value: {{item.estimatedValue | currency:'USD'}}
                </span>
              </div>
              <span class="text-white/70 text-sm border border-white/70 px-2 py-1 rounded">
                {{item.year || 'Year unknown'}}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="items.length === 0" class="text-center py-12">
        <p class="text-white text-xl font-retrofuture">No items found</p>
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
  items: ItemDTO[] = [];
  loading = false;
  searchQuery: string = '';

  constructor(
    private itemService: ItemService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.itemService.list().subscribe({
      next: (items: ItemDTO[]) => {
        this.items = items;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading items:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    // Implement search functionality if needed
    this.loadItems();
  }

  viewDetails(item: ItemDTO) {
    this.router.navigate(['/items', item.id]);
  }
} 
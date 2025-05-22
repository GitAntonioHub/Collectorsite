import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from './listing.service';
import { ListingDTO } from './models';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../core/state/auth.store';

@Component({
  standalone: true,
  selector: 'app-listing-detail',
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="container mx-auto p-6" *ngIf="listing">
      <div class="bg-black/50 border-2 border-white p-8">
        <!-- Back button -->
        <button class="retro-btn mb-6" (click)="goBack()">
          ← Back to Listings
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column: Image -->
          <div class="aspect-square bg-black/30 border-2 border-white">
            <!-- Image placeholder - replace with actual image -->
            <div class="w-full h-full flex items-center justify-center text-white/50">
              Item Image
            </div>
          </div>

          <!-- Right Column: Details -->
          <div class="space-y-6">
            <h1 class="text-3xl font-bold text-white">{{ listing.title }}</h1>
            
            <div class="flex items-center justify-between">
              <span class="text-2xl text-white">
                {{ listing.price | currency:listing.currency }}
              </span>
              <span class="text-white/70 text-lg border-2 border-white/70 px-3 py-1">
                {{ listing.listingType }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3 pt-4">
              <button *ngIf="listing.listingType === 'AUCTION'"
                      class="retro-btn w-full"
                      [disabled]="!auth.isAuthenticated"
                      (click)="placeBid()">
                Place Bid
              </button>
              
              <button *ngIf="listing.listingType === 'SALE'"
                      class="retro-btn w-full"
                      [disabled]="!auth.isAuthenticated"
                      (click)="purchase()">
                Purchase Now
              </button>

              <button class="retro-btn w-full"
                      [disabled]="!auth.isAuthenticated"
                      (click)="contact()">
                Contact Seller
              </button>
            </div>

            <!-- Item Details -->
            <div class="mt-8 space-y-4">
              <h2 class="text-xl font-semibold text-white">Item Details</h2>
              <p class="text-white/90">
                Description will go here when available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .retro-btn {
      font-family: 'RetroFuture', sans-serif !important;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      height: 2.5rem !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 1rem !important;
      background: black !important;
      border: 2px solid white !important;
      color: white !important;
      cursor: pointer;
      transition: all 0.2s;
    }
    .retro-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1) !important;
    }
    .retro-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ListingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listingService = inject(ListingService);
  protected auth = inject(AuthStore);

  listing?: ListingDTO;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.listingService.get(id).subscribe(
        listing => this.listing = listing
      );
    }
  }

  goBack() {
    this.router.navigate(['/listings']);
  }

  placeBid() {
    // Implement bid placement logic
    console.log('Place bid');
  }

  purchase() {
    // Implement purchase logic
    console.log('Purchase item');
  }

  contact() {
    // Implement contact seller logic
    console.log('Contact seller');
  }
} 
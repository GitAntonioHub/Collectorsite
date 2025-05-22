import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItemService } from './item.service';
import { ItemDTO, ItemImage } from './models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-item-public-detail',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="container mx-auto p-6" *ngIf="item">
      <div class="bg-black/50 border-2 border-white p-8">
        <!-- Back button -->
        <button class="retro-btn mb-6" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon> Back to Browse
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column: Images -->
          <div class="space-y-4">
            <div class="aspect-square bg-black/30 border-2 border-white overflow-hidden">
              <img *ngIf="currentImage" [src]="currentImage.url" [alt]="item.title" 
                   class="w-full h-full object-cover">
              <div *ngIf="!currentImage" class="w-full h-full flex items-center justify-center text-white/50">
                No Image Available
              </div>
            </div>

            <!-- Thumbnail Grid -->
            <div *ngIf="(item.images?.length || 0) > 1" class="grid grid-cols-4 gap-2">
              <div *ngFor="let img of item.images || []" 
                   class="aspect-square bg-black/30 border-2 cursor-pointer"
                   [class.border-cyan-400]="img === currentImage"
                   [class.border-white]="img !== currentImage"
                   (click)="currentImage = img">
                <img [src]="img.url" [alt]="item.title" class="w-full h-full object-cover">
              </div>
            </div>
          </div>

          <!-- Right Column: Details -->
          <div class="space-y-6">
            <h1 class="text-3xl font-bold text-white font-retrofuture uppercase">{{ item.title }}</h1>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="text-white">
                <span class="text-white/70">Condition:</span><br>
                {{ item.condition || 'Not specified' }}
              </div>
              <div class="text-white">
                <span class="text-white/70">Year:</span><br>
                {{ item.year || 'Not specified' }}
              </div>
              <div class="text-white">
                <span class="text-white/70">Estimated Value:</span><br>
                {{ item.estimatedValue ? ('$' + item.estimatedValue) : 'Not specified' }}
              </div>
              <div class="text-white">
                <span class="text-white/70">Status:</span><br>
                {{ item.status }}
              </div>
            </div>

            <div class="space-y-2">
              <h2 class="text-xl font-semibold text-white">Description</h2>
              <p class="text-white/90">{{ item.description }}</p>
            </div>

            <!-- Documents Section -->
            <div *ngIf="(item.documents?.length || 0) > 0" class="space-y-4">
              <h2 class="text-xl font-semibold text-white">Documents</h2>
              <div class="space-y-2">
                <a *ngFor="let doc of item.documents || []" 
                   [href]="doc.filePath" 
                   target="_blank"
                   class="block bg-black/30 border-2 border-white p-3 text-white hover:bg-black/50 transition-all">
                  <mat-icon class="align-middle mr-2">description</mat-icon>
                  View Document
                </a>
              </div>
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
    .retro-btn:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }
    .retro-btn mat-icon {
      margin-right: 0.5rem;
    }
  `]
})
export class ItemPublicDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private itemService = inject(ItemService);

  item?: ItemDTO;
  currentImage?: ItemImage;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.itemService.get(id).subscribe({
        next: (item: ItemDTO) => { 
          this.item = item;
          this.currentImage = item.images?.find((img: any) => img.isPrimary) || item.images?.[0];
        },
        error: (err: Error) => { 
          console.error('Failed to load item:', err);
          this.router.navigate(['/browse']);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/browse']);
  }
} 
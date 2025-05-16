import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDropComponent } from './file-drop.component';
import { UploadService } from './upload.service';
import { ItemImage, ItemDocument } from './models';

@Component({
  standalone: true,
  selector: 'item-detail',
  imports: [CommonModule, FileDropComponent],
  template: `
    <div class="space-y-6">
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-white font-retrofuture uppercase">{{ title }}</h3>
        <p class="text-white/90">{{ description }}</p>
      </div>

      <!-- Images Section -->
      <div class="space-y-4">
        <h4 class="text-lg font-bold text-white font-retrofuture uppercase">Images</h4>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div *ngFor="let img of images" 
               class="aspect-square bg-black/30 border-2 border-white overflow-hidden">
            <img [src]="img.url" class="w-full h-full object-cover">
          </div>
        </div>

        <!-- File Drop Zone -->
        <file-drop 
          (files)="upload($event)"
          class="block border-2 border-dashed border-white/50 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-400 transition-colors">
          <p class="text-white font-retrofuture">Drop images here or click to choose</p>
        </file-drop>
      </div>

      <!-- Documents Section -->
      <div class="space-y-4">
        <h4 class="text-lg font-bold text-white font-retrofuture uppercase">Documents</h4>
        
        <div *ngIf="docs.length === 0" class="text-white/70 text-center py-4">
          No documents uploaded yet
        </div>
        
        <ul class="space-y-2">
          <li *ngFor="let doc of docs" 
              class="bg-black/30 border-2 border-white p-3 flex justify-between items-center">
            <span class="text-white font-retrofuture">{{ doc.type }}</span>
            <a [href]="doc.filePath" 
               target="_blank"
               class="text-cyan-400 hover:text-cyan-300 transition-colors font-retrofuture uppercase">
              View
            </a>
          </li>
        </ul>

        <!-- File Drop Zone for Documents -->
        <file-drop 
          (files)="upload($event)"
          class="block border-2 border-dashed border-white/50 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-400 transition-colors">
          <p class="text-white font-retrofuture">Drop documents here or click to choose</p>
        </file-drop>
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
export class ItemDetailComponent {
  @Input() itemId!: string;
  @Input() title = '';
  @Input() description = '';

  images: ItemImage[] = [];
  docs: ItemDocument[] = [];

  constructor(private up: UploadService) {}

  upload(list: FileList) {
    Array.from(list).forEach(f => {
      if (f.type.startsWith('image/')) {
        this.up.uploadImage(this.itemId, f).subscribe(i => this.images.push(i));
      } else {
        this.up.uploadDoc(this.itemId, f).subscribe(d => this.docs.push(d));
      }
    });
  }
}

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
  <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
  <p class="mb-4">{{ description }}</p>

  <h4 class="font-medium mt-4 mb-1">Images</h4>
  <div class="flex gap-2 mb-4">
    <img *ngFor="let img of images" [src]="img.url" class="w-24 h-24 object-cover rounded">
  </div>

  <file-drop (files)="upload($event)"></file-drop>

  <h4 class="font-medium mt-6 mb-1">Documents</h4>
  <ul class="list-disc pl-5">
    <li *ngFor="let d of docs">
      <a [href]="d.filePath" target="_blank">{{ d.type }}</a>
    </li>
  </ul>
  `,
  styles: [`.w-24{width:6rem;height:6rem}`]
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

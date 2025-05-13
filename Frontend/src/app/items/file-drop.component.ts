import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'file-drop',
  imports: [CommonModule],
  styles: [`
    .drop-zone { @apply flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors; }
  .drop-zone.drag { @apply border-blue-500 bg-blue-50; }
  `],
  templateUrl: './file-drop.component.html'
})
export class FileDropComponent {
  drag = false;
  @Output() files = new EventEmitter<FileList>();

onDrop(e: DragEvent) {
  e.preventDefault();
  this.drag = false;
  if (e.dataTransfer?.files?.length) this.files.emit(e.dataTransfer.files);
}
onFiles(fl: FileList) {
  this.files.emit(fl);
}
}

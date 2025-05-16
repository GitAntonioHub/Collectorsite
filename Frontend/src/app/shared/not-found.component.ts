import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[70vh] text-white">
      <h1 class="text-6xl mb-4">404</h1>
      <p class="text-xl">Page not found</p>
    </div>
  `
})
export class NotFoundComponent {} 
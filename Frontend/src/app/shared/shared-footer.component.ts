import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'shared-footer',
  imports: [CommonModule],
  template: `
    <footer class="fixed bottom-4 inset-x-0 flex justify-center z-10">
    <span class="retro-btn px-6 py-2 text-xs w-auto">
      © {{year}} Collector‑Site · Retro Marketplace
    </span>
    </footer>
  `
})
export class SharedFooterComponent {
  year = new Date().getFullYear();
}

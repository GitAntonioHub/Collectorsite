import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'shared-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-4 inset-x-0 flex justify-center z-10">
      <div class="flex gap-3">
        <a routerLink="/" class="retro-btn font-bold w-40">Collector‑Site</a>
        <a routerLink="/listings"  routerLinkActive="scale-110" class="retro-btn">Browse</a>
        <a routerLink="/my-items"  routerLinkActive="scale-110" class="retro-btn">My&nbsp;Items</a>
        <a routerLink="/offers"    routerLinkActive="scale-110" class="retro-btn">Trade</a>
        <a routerLink="/verify"    routerLinkActive="scale-110" class="retro-btn">Admin</a>
      </div>
    </header>
  `
})
export class SharedHeaderComponent {}

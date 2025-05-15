import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone:true,
  selector:'shared-header',
  imports:[CommonModule,RouterLink],
  template:`
    <header>
      <nav class="flex gap-3">
        <a routerLink="/"            class="retro-btn" style="font-weight:700;width:10rem">Collector‑Site</a>
        <a routerLink="/listings"    class="retro-btn">Browse</a>
        <a routerLink="/my-items"    class="retro-btn">My&nbsp;Items</a>
        <a routerLink="/offers"      class="retro-btn">Trade</a>
        <a routerLink="/verify"      class="retro-btn">Admin</a>
        <a routerLink="/login"       class="retro-btn">Login</a>
      </nav>
    </header>
  `
})
export class SharedHeaderComponent{}

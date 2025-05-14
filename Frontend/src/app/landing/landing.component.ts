import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  template:`
  <section class=\"text-center mt-40 space-y-4\">
    <h1 class=\"text-5xl font-bold\">Collectorsite Marketplace</h1>
    <p class=\"text-lg\">Buy • Sell • Trade Unique Items</p>
    <a routerLink=\"/listings\" class=\"retro-btn w-40\">Enter</a>
  </section>
  `,
  imports:[CommonModule]
})
export class LandingComponent{}

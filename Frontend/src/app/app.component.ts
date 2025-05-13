import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
  <mat-toolbar color="primary" class="justify-between">
    <span routerLink="/" class="cursor-pointer">Collector‑Site</span>
    <span>
      <button mat-button routerLink="/listings">Browse</button>
      <button mat-button routerLink="/my-items">My Items</button>
      <button mat-button routerLink="/offers">Trade Offers</button>
      <button mat-button routerLink="/verify">Admin</button>
    </span>
  </mat-toolbar>
  <router-outlet/>
  `,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, RouterLink]
})
export class AppComponent { }

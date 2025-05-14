import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {HoloBackgroundComponent} from './shared/holo-background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <holo-background>
      <mat-toolbar color="primary"
                   class="justify-between backdrop-blur-sm/20 bg-white/10">
        <span routerLink="/" class="cursor-pointer tracking-wider">Collector‑Site</span>
        <span>
        <button mat-button routerLink="/listings">Browse</button>
        <button mat-button routerLink="/my-items">My Items</button>
        <button mat-button routerLink="/offers">Trade</button>
        <button mat-button routerLink="/verify">Admin</button>
      </span>
      </mat-toolbar>

      <router-outlet/>
    </holo-background>
  `,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, RouterLink, HoloBackgroundComponent]
})
export class AppComponent {
    title(title: any) {
        throw new Error('Method not implemented.');
    }
}

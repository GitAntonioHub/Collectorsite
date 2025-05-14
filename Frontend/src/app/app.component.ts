/* src/app/app.component.ts */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HoloBackgroundComponent } from './shared/holo-background.component';
import { SharedHeaderComponent } from './shared/shared-header.component';
import { SharedFooterComponent } from './shared/shared-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HoloBackgroundComponent,
    SharedHeaderComponent,
    RouterOutlet,
    SharedFooterComponent
  ],
  template: `
    <holo-background>
      <shared-header></shared-header>

      <main class="pt-24 pb-24">
        <router-outlet/>
      </main>

      <shared-footer></shared-footer>
    </holo-background>
  `
})
export class AppComponent {
    title(title: any) {
        throw new Error('Method not implemented.');
    }
}

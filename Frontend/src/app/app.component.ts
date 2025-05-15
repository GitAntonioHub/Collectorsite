import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HoloBackgroundComponent } from './shared/holo-background.component';
import { SharedHeaderComponent } from './shared/shared-header.component';
import { SharedFooterComponent } from './shared/shared-footer.component';
import { AccessibilityControlsComponent } from './shared/accessibility-controls.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HoloBackgroundComponent,
    SharedHeaderComponent,
    SharedFooterComponent,
    AccessibilityControlsComponent
  ],
  template: `
    <holo-background [showHolo]="isLanding">
      <shared-header></shared-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <shared-footer></shared-footer>
      <app-accessibility-controls *ngIf="isLanding"></app-accessibility-controls>
    </holo-background>
  `
})
export class AppComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  isLanding = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.isLanding = e.urlAfterRedirects === '/';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

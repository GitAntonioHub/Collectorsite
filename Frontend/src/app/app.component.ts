import { Component } from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import { HoloBackgroundComponent } from './shared/holo-background.component';
import { SharedHeaderComponent } from './shared/shared-header.component';
import { SharedFooterComponent } from './shared/shared-footer.component';
import {HoloToggleComponent} from './ui/holo-toggle.component';

@Component({
  standalone:true,
  selector:'app-root',
  imports: [HoloBackgroundComponent, SharedHeaderComponent, SharedFooterComponent, RouterOutlet, HoloToggleComponent],
  template:`

    <holo-background [showHolo]="isLanding">
      <app-holo-toggle></app-holo-toggle>
      <shared-header></shared-header>
      <router-outlet></router-outlet>
      <shared-footer></shared-footer>
    </holo-background>

  `
})
export class AppComponent{
  title(title: any) {
      throw new Error('Method not implemented.');
  }
  isLanding=false;
  constructor(private router:Router){
    this.router.events.subscribe(e=>{
      if(e instanceof NavigationEnd){
        this.isLanding = e.urlAfterRedirects === '/';
      }
    });
  }
}

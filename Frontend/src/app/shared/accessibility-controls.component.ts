import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationToggleService } from '../core/state/animation-toggle.service';

@Component({
  selector: 'app-accessibility-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="retro-btn !absolute !top-0 !left-0 !m-0 flex items-center justify-center"
      (click)="toggleAnimation()"
      aria-label="Toggle animations">
      Toggle Animations
    </button>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1100;
    }
    button {
      border-radius: 0 !important;
      background: black !important;
      border: 2px solid white !important;
      border-top: none !important;
      border-left: none !important;
      white-space: nowrap;
      height: 32px !important;
      padding: 0 12px !important;
      font-family: 'RetroFuture', sans-serif !important;
      font-size: 12px !important;
      letter-spacing: 0.05em !important;
      text-transform: uppercase;
      line-height: 1 !important;
    }
    button:hover {
      background: black !important;
    }
  `]
})
export class AccessibilityControlsComponent {
  constructor(public toggle: AnimationToggleService) {}

  toggleAnimation() {
    const holos = document.querySelectorAll('.holo') as NodeListOf<HTMLElement>;
    
    holos.forEach(holo => {
      if (!this.toggle.disabled()) {
        // If animations are currently playing, stop them and reset to initial position
        holo.style.animation = 'none';
        holo.style.transform = 'rotate(0deg)';
      } else {
        // If animations are currently paused, resume them
        holo.style.animation = '';
        holo.style.transform = '';
      }
    });
    
    this.toggle.toggle();
  }
}

// src/app/ui/holo-toggle.component.ts
import { Component } from '@angular/core';
import { AnimationToggleService } from '../core/state/animation-toggle.service';

@Component({
  selector: 'app-holo-toggle',
  standalone: true,
  template: `
    <button (click)="toggle.toggle()"
            class="fixed left-4 top-4 w-4 h-4 rounded-sm
                   bg-cyan-400/80 border border-white
                   hover:bg-cyan-300 transition-colors">
    </button>`,
})
export class HoloToggleComponent {
  constructor(public toggle: AnimationToggleService){}
}

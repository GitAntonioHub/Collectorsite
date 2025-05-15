// src/app/core/state/animation-toggle.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnimationToggleService {
  readonly disabled = signal(false);
  toggle(): void {
    this.disabled.update(v => !v);
  }
}

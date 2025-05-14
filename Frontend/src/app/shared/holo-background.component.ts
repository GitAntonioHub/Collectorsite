/* src/app/shared/holo-background.component.ts */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const style = `
@keyframes spinY{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
.hologram{position:absolute;top:50%;transform:translateY(-50%);
 width:220px;height:220px;opacity:.75;animation:spinY 12s linear infinite}
.holo-left{left:2rem}.holo-right{right:2rem;animation-direction:reverse}
.bg-overlay::before{content:'';position:fixed;inset:0;background:#000b;
 pointer-events:none;z-index:-1}
`;

@Component({
  standalone: true,
  selector: 'holo-background',
  imports: [CommonModule],
  host: { class: 'block min-h-screen relative bg-overlay font-retro' },
  styles: [style],
  template: `
    <!-- parallax background -->
    <img src="assets/bg.jpg"
         alt="background"
         class="fixed inset-0 -z-10 w-full h-full object-cover object-center">

    <!-- spinning holograms -->
    <img src="assets/holo-left.png"  alt="hologram left"  class="hologram holo-left">
    <img src="assets/holo-right.png" alt="hologram right" class="hologram holo-right">

    <!-- app content -->
    <ng-content/>
  `
})
export class HoloBackgroundComponent {}

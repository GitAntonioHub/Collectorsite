import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

const style = `
@keyframes spinY{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}

.hologram{
  position:absolute;top:40%;transform:translateY(-40%);
  width:300px;height:300px;opacity:.85;
  animation:spinY 12s linear infinite;
}
.holo-left { left:1rem; }
.holo-right{ right:1rem; }

.bg-cover::before{
  content:'';position:fixed;inset:0;z-index:-1;
  background:url('/assets/bg.jpg') center/cover no-repeat fixed;   /* <-- leading slash */
}
`;

@Component({
  standalone: true,
  selector: 'holo-background',
  imports: [CommonModule, NgOptimizedImage],
  host: { class: 'block min-h-screen relative font-retro text-white' },
  styles: [style],
  template: `
    <img ngSrc="../../assets/holo-left.png" class="hologram holo-left" alt="" height="920" width="718">
    <img ngSrc="../../assets/holo-right.png" class="hologram holo-right" alt="" height="680" width="497">
    <ng-content/>
  `
})
export class HoloBackgroundComponent {}

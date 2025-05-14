/* src/app/shared/holo-background.component.ts */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

const css = `
@keyframes spinY{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
.holo{position:absolute;top:40%;transform:translateY(-40%);
      width:300px;height:300px;opacity:.85;animation:spinY 12s linear infinite}
.holo-left{left:1rem}.holo-right{right:1rem;animation-direction:reverse}
.bg-cover::before{content:'';position:fixed;inset:0;
  background:url('../../assets/bg.jpg') center/cover no-repeat fixed;z-index:-1}
`;

@Component({
  standalone:true,
  selector:'holo-background',
  imports:[CommonModule],
  host:{class:'block min-h-screen relative bg-cover font-retro text-white'},
  styles:[css],
  template:`
    <!-- show holograms only when flag is true -->
    <img *ngIf=\"showHolo\" src=\"../../assets/holo-left.png\"  class=\"holo holo-left\">
    <img *ngIf=\"showHolo\" src=\"../../assets/holo-right.png\" class=\"holo holo-right\">
    <ng-content/>
  `
})
export class HoloBackgroundComponent{
  @Input() showHolo = false;
}

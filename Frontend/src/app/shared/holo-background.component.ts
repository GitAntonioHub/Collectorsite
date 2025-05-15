import {Component, computed, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnimationToggleService} from '../core/state/animation-toggle.service';

const css = `
@keyframes spinY{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}

:host{
  display:block;min-height:100vh;position:relative;
  font-family:'RetroFuture',sans-serif;color:#00bfff;
}
:host::before{
  content:'';position:fixed;inset:0;z-index:-1;
  background:url('../../assets/bg.jpg') center/cover no-repeat fixed;
}

/* holograms */
.holo{position:absolute;top:40%;transform:translateY(-40%);
      width:300px;height:300px;opacity:.85;animation:spinY 12s linear infinite}
.holo-left{left:1rem}.holo-right{right:1rem;animation-direction:reverse}
`;

@Component({
  standalone:true,
  selector:'holo-background',
  imports:[CommonModule],
  styles:[css],
  template:`
    <img *ngIf="showHolo" src="../../assets/holo-left.png"  class="holo holo-left"[style.animation-play-state]="playState()"/>
    <img *ngIf="showHolo" src="../../assets/holo-right.png" class="holo holo-right"[style.animation-play-state]="playState()"/>
    <ng-content/>
  `
})
export class HoloBackgroundComponent{
  readonly playState = computed(() =>
    this.toggle.disabled() ? 'paused' : 'running');
  @Input() showHolo = false;

  constructor(private toggle: AnimationToggleService){}
}

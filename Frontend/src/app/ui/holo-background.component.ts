import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'holo-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="holo-container" [class.active]="showHolo">
      <div class="holo-effect"></div>
    </div>
  `,
  styles: [`
    .holo-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
      z-index: -1;
    }
    
    .holo-container.active {
      opacity: 1;
    }
    
    .holo-effect {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg, 
        rgba(131,58,180,0.05) 0%, 
        rgba(253,29,29,0.05) 50%, 
        rgba(252,176,69,0.05) 100%
      );
      animation: rotate 20s linear infinite;
      filter: blur(10px);
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class HoloBackgroundComponent implements OnInit {
  @Input() showHolo = false;

  constructor() {}

  ngOnInit(): void {}
} 
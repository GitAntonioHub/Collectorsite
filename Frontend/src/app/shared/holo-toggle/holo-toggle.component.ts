import {Component, HostBinding} from '@angular/core';
import {holoRotationEnabled} from '../../core/state/holo-rotation.signal';

@Component({
  selector: 'holo-rotation-toggle',
  standalone: true,
  templateUrl: './holo-toggle.component.html',
  styleUrls: ['./holo-toggle.component.css'],
})
export class HoloToggleComponent {
  readonly enabled = holoRotationEnabled;

  toggle() {
    this.enabled.set(!this.enabled());
  }

  /** stick it in the top-left, above everything */
  @HostBinding('style.position')   pos = 'fixed';
  @HostBinding('style.top')        top = '8px';
  @HostBinding('style.left')       left = '8px';
  @HostBinding('style.zIndex')     z   = '10000';
}

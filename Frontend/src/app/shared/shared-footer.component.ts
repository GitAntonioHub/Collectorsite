import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'shared-footer',
  imports: [CommonModule],
  template: `
    <!-- footer -->
    <footer>
  <span class="retro-btn" style="width:auto;padding:0 2rem">
    © <span id="yr"></span> Collector‑Site
  </span>
    </footer>
    <script>document.getElementById('yr').textContent=new Date().getFullYear();</script>
  `
})
export class SharedFooterComponent {
  year = new Date().getFullYear();
}

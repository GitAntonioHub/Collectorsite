import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <h1 class="text-4xl font-bold mb-4">404</h1>
      <p class="text-xl mb-8">Page not found</p>
      <button mat-raised-button color="primary" routerLink="/">
        Return to Home
      </button>
    </div>
  `
})
export class NotFoundComponent {} 
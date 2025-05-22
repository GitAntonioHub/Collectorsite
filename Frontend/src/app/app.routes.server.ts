import { RenderMode, ServerRoute } from '@angular/ssr';

// Don't prerender anything, use client-side rendering
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];

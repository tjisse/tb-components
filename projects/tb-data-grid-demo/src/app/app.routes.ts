import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'vanilla', pathMatch: 'full' },
  {
    path: 'vanilla',
    loadComponent: () =>
      import('./components/demo/vanilla-demo').then((m) => m.VanillaDemoComponent),
  },
  {
    path: 'bootstrap',
    loadComponent: () =>
      import('./components/demo/bootstrap-demo').then((m) => m.BootstrapDemoComponent),
  },
];

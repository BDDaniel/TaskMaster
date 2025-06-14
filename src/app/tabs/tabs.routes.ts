import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.Home),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('../tasks/tasks.page').then((m) => m.Tasks),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('../categories/categories.page').then((m) => m.Categories),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

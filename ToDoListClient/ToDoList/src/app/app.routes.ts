import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./task/task.component/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'tasks' }
];

import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.routes').then((m) => m.routes),
  },
  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

import { Routes } from '@angular/router';
import { EstructuraEmpresaComponent } from './estructura-empresa.component';
import { PrestacionesSocialesComponent } from '../../../../funcionarios/create/prestaciones-sociales/prestaciones-sociales.component';

export const routes: Routes = [
  { path: 'gestion-estructure', component: EstructuraEmpresaComponent },
  { path: 'prestaciones-sociales', component: PrestacionesSocialesComponent },
  {
    path: 'turneros',
    loadChildren: () => import('src/app/pages/turnero/turnero.routes').then((m) => m.routes),
  },
];

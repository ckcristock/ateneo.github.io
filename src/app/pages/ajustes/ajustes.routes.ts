import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'informacion-base',
    loadChildren: () => import('./informacion-base/informacion-base.routes').then((m) => m.routes),
  },
  {
    path: 'tipos',
    loadChildren: () => import('./tipos/tipos.routes').then((m) => m.routes),
  },
  {
    path: 'parametros',
    loadChildren: () => import('./parametros/parametros.routes').then((m) => m.routes),
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion/configuracion.routes').then((m) => m.routes),
  },
  {
    path: 'encuestas',
    loadChildren: () => import('./encuestas/encuestas.routes').then((m) => m.routes),
  },
  {
    path: 'structure-company',
    loadChildren: () =>
      import(
        './informacion-base/empresas/company-configuration/components/structure-company/structure-company.routes'
      ).then((m) => m.routes),
  },
];

import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskViewComponent } from './tasks/task-view/task-view.component';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'task', component: TasksComponent },
  { path: 'task/:id', component: TaskViewComponent },
  {
    path: 'agendamiento',
    loadChildren: () => import('./agendamiento/agendamiento.routes').then((m) => m.routes),
  },
  {
    path: 'gestion-riesgo',
    loadChildren: () => import('./gestion-riesgo/gestion-riesgo.routes').then((m) => m.routes),
  },
  {
    path: 'cuentas-medicas',
    loadChildren: () => import('./cuentas-medicas/cuentas-medicas.routes').then((m) => m.routes),
  },
  {
    path: 'sst',
    loadChildren: () => import('./sst/sst.routes').then((m) => m.routes),
  },
  {
    path: 'ajustes',
    loadChildren: () => import('./ajustes/ajustes.routes').then((m) => m.routes),
  },
  {
    path: 'compras',
    loadChildren: () => import('./compras/compras.routes').then((m) => m.routes),
  },
  {
    path: 'inventario',
    loadChildren: () => import('./inventario/inventario.routes').then((m) => m.routes),
  },
  {
    path: 'rrhh',
    loadChildren: () => import('./rrhh/rrhh.routes').then((m) => m.routes),
  },
  {
    path: 'contabilidad',
    loadChildren: () => import('./contabilidad/contabilidad.routes').then((m) => m.routes),
  },
  {
    path: 'nomina',
    loadChildren: () => import('./nomina/nomina.routes').then((m) => m.routes),
  },
  //{ path: 'grafical-resume', loadChildren: () => import('./grafical-module/grafical-module.module').then(m => m.GraficalModuleModule) },
];

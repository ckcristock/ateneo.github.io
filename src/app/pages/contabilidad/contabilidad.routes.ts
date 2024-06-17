import { Routes } from '@angular/router';
import { PlanCuentasComponent } from './plan-cuentas/plan-cuentas.component';
import { CentroCostosComponent } from './centro-costos/centro-costos.component';
import { ActivosFijosComponent } from './activos-fijos/activos-fijos.component';
import { ActivosFijosCrearComponent } from './activos-fijos/activos-fijos-crear/activos-fijos-crear.component';
import { ActivosFijosVerComponent } from './activos-fijos/activos-fijos-ver/activos-fijos-ver.component';
import { CajasComponent } from './cajas/cajas.component';
import { CierresContablesComponent } from './cierres-contables/cierres-contables.component';
import { DepreciacionComponent } from './depreciacion/depreciacion.component';
import { TabladepreciacionesComponent } from './depreciacion/tabladepreciaciones/tabladepreciaciones.component';
import { InventariosValorizadosComponent } from './inventarios-valorizados/inventarios-valorizados.component';
import { BalancePruebaComponent } from './balance-prueba/balance-prueba.component';

export const routes: Routes = [
  {
    path: 'comprobantes',
    loadChildren: () => import('./comprobantes/comprobantes.routes').then((m) => m.routes),
  },
  {
    path: 'balances',
    loadChildren: () => import('./balances/balances.routes').then((m) => m.routes),
  },
  {
    path: 'estados',
    loadChildren: () => import('./estados/estados.routes').then((m) => m.routes),
  },
  {
    path: 'informesdian',
    loadChildren: () => import('./informesdian/informesdian.routes').then((m) => m.routes),
  },
  { path: 'plan-cuentas', component: PlanCuentasComponent },
  { path: 'centro-costos', component: CentroCostosComponent },
  { path: 'activos-fijos', component: ActivosFijosComponent },
  { path: 'activos-fijos-crear', component: ActivosFijosCrearComponent },
  { path: 'activo-fijo-ver/:id', component: ActivosFijosVerComponent },
  { path: 'cajas', component: CajasComponent },
  { path: 'depreciacion', component: DepreciacionComponent },
  { path: 'depreciaciones', component: TabladepreciacionesComponent },
  { path: 'balance-pruebas', component: BalancePruebaComponent },
  { path: 'cierres-contables', component: CierresContablesComponent },
  { path: 'inventarios-valorizados', component: InventariosValorizadosComponent },
  // { path: 'crear', component: ActivosFijosCrearComponent },
];

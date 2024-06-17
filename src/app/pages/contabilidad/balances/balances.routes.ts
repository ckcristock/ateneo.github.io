import { Routes } from '@angular/router';
import { BalanceGeneralComponent } from './balance-general/balance-general.component';
import { MovimientoGlobalizadoComponent } from './movimiento-globalizado/movimiento-globalizado.component';

export const routes: Routes = [
  { path: 'general', component: BalanceGeneralComponent },
  { path: 'movimiento-globalizado', component: MovimientoGlobalizadoComponent },
];

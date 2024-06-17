import { DetalleNominaElectronicaComponent } from './detalle-nomina-electronica/detalle-nomina-electronica.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'historial/:id',
    component: DetalleNominaElectronicaComponent,
  },
];

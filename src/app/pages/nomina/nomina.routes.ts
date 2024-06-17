import { Routes } from '@angular/router';
import { PrestamosLibranzasComponent } from './prestamos-libranzas/prestamos-libranzas.component';
import { ViaticosComponent } from './viaticos/viaticos.component';
import { CrearViaticosComponent } from './viaticos/crear-viaticos/crear-viaticos.component';
import { VerViaticosComponent } from './viaticos/ver-viaticos/ver-viaticos.component';
import { EditarViaticoComponent } from './viaticos/editar-viatico/editar-viatico.component';
import { VacacionesComponent } from './vacaciones/vacaciones.component';
import { PrimasComponent } from './primas/primas.component';
import { PrimaFuncionarioComponent } from './primas/prima-funcionario/prima-funcionario.component';
import { HistorialPagosComponent } from './historial-pagos/historial-pagos.component';
import { CesantiasComponent } from './cesantias/cesantias.component';
import { CesantiaCurrentComponent } from './cesantias/cesantia-current/cesantia-current.component';
import { CesantiasVerComponent } from './cesantias/cesantias-ver/cesantias-ver.component';
import { NominaComponent } from './nomina/nomina.component';
import { ProvisionesComponent } from './provisiones/provisiones.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { ViewReportComponent } from './historial-pagos/components/view-report/view-report.component';

export const routes: Routes = [
  {
    path: 'nomina',
    loadChildren: () => import('./nomina/pago-nomina.routes').then((m) => m.routes),
  },
  {
    path: 'nomina-electronica',
    loadChildren: () =>
      import('./nomina-electronica/nomina-electronica.routes').then((m) => m.routes),
  },
  { path: 'historial-pagos/:id', component: ViewReportComponent },
  { path: 'prestamos', component: PrestamosLibranzasComponent },
  { path: 'provisiones', component: ProvisionesComponent },
  { path: 'prestamos', component: PrestamosLibranzasComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: 'viaticos', component: ViaticosComponent },
  { path: 'ver-viatico/:id', component: VerViaticosComponent },
  { path: 'crear-viatico', component: CrearViaticosComponent },
  { path: 'editar-viatico/:id', component: EditarViaticoComponent },
  { path: 'vacaciones', component: VacacionesComponent },
  { path: 'primas', component: PrimasComponent },
  { path: 'prima/:anio/:periodo/:pagado', component: PrimaFuncionarioComponent },
  { path: 'historial-pagos', component: HistorialPagosComponent },
  { path: 'cesantias', component: CesantiasComponent },
  { path: 'cesantias/ver/:type/:id', component: CesantiasVerComponent },
  { path: 'cesantias/:type/:year', component: CesantiaCurrentComponent },
];

import { Routes } from '@angular/router';
import { AbrirAgendasComponent } from './abrir-agendas/abrir-agendas.component';
import { ActaAplicacionComponent } from './acta-aplicacion/acta-aplicacion.component';
import { AgendasComponent } from './agendas/agendas.component';
import { VerAgendaComponent } from './agendas/ver-agenda/ver-agenda.component';
import { AsignacionCitasComponent } from './asignacion-citas/asignacion-citas.component';
import { CallInComponent } from './call-in/call-in.component';
import { IndicadoresGestionComponent } from './indicadores-gestion/indicadores-gestion.component';
import { ListaEsperaComponent } from './lista-espera/lista-espera.component';
import { ListaTrabajoComponent } from './lista-trabajo/lista-trabajo.component';
import { RecaudosComponent } from './recaudos/recaudos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ListaActaAplicacionComponent } from './lista-acta-aplicacion/lista-acta-aplicacion.component';
import { IniciarCitaComponent } from './lista-trabajo/iniciar-cita/iniciar-cita.component';

export const routes: Routes = [
  { path: 'abrir-agendas', component: AbrirAgendasComponent },
  { path: 'actaaplicacion', component: ActaAplicacionComponent },
  { path: 'listaactaaplicacion', component: ListaActaAplicacionComponent },
  { path: 'asignacion-citas/:id', component: AsignacionCitasComponent },
  { path: 'asignacion-citas', component: AsignacionCitasComponent },
  { path: 'lista-espera', component: ListaEsperaComponent },
  { path: 'lista-trabajo', component: ListaTrabajoComponent },
  { path: 'lista-trabajo/cita/:id', component: IniciarCitaComponent },
  { path: 'indicadores-gestion', component: IndicadoresGestionComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'agendas', component: AgendasComponent },
  { path: 'recaudos', component: RecaudosComponent },
  { path: 'detalle-agenda/:id', component: VerAgendaComponent },
  { path: 'llamadas-por-paciente', component: CallInComponent },
  {
    path: 'replay-migrate',
    loadChildren: () => import('./replay-migrate/replay-migrate.routes').then((m) => m.routes),
  },
];

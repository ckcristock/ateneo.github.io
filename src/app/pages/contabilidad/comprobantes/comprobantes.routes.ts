import { Routes } from '@angular/router';
import { NotasContablesComponent } from './notas-contables/notas-contables.component';
import { CrearNotaContableComponent } from './notas-contables/crear-nota-contable/crear-nota-contable.component';
import { EgresosComponent } from './egresos/egresos.component';
import { ComprobanteegresovarioscrearComponent } from './egresos/comprobanteegresovarioscrear/comprobanteegresovarioscrear.component';
import { ComprobanteingresocrearComponent } from './ingresos/comprobanteingresocrear/comprobanteingresocrear.component';
import { IngresosComponent } from './ingresos/ingresos.component';
import { NotasCarterasComponent } from './notas-carteras/notas-carteras.component';
import { NotascarteracrearComponent } from './notas-carteras/notascarteracrear/notascarteracrear.component';
import { NotascreditoComponent } from './notascredito/notascredito.component';
import { NotascreditocrearComponent } from './notascredito/notascreditocrear/notascreditocrear.component';
import { NotascreditoverComponent } from './notascredito/notascreditover/notascreditover.component';
import { NotasDebitoComponent } from './notas-debito/notas-debito.component';
import { TiposNotaCreditoComponent } from './notascredito/tipos-nota-credito/tipos-nota-credito.component';
import { NotasDebitoVerComponent } from './notas-debito/notas-debito-ver/notas-debito-ver.component';
import { NotasDebitoCrearComponent } from './notas-debito/notas-debito-crear/notas-debito-crear.component';

export const routes: Routes = [
  { path: 'notas-contables', component: NotasContablesComponent },
  { path: 'crear-nota-contable', component: CrearNotaContableComponent },
  { path: 'egresos', component: EgresosComponent },
  { path: 'comprobanteegresovarioscrear', component: ComprobanteegresovarioscrearComponent },
  { path: 'ingresos', component: IngresosComponent },
  { path: 'comprobanteingresocrear', component: ComprobanteingresocrearComponent },
  /* { path: 'notas-cartera', component: NotasCarterasComponent },
  { path: 'notas-cartera-crear', component: NotascarteracrearComponent }, */
  { path: 'notas-credito', component: NotascreditoComponent },
  { path: 'notas-credito/crear', component: NotascreditocrearComponent },
  { path: 'notas-credito/tipos', component: TiposNotaCreditoComponent },
  { path: 'notas-credito/ver/:id', component: NotascreditoverComponent },
  { path: 'notas-debito', component: NotasDebitoComponent },
  { path: 'notas-debito/crear', component: NotasDebitoCrearComponent },
  { path: 'notas-debito/ver/:id', component: NotasDebitoVerComponent },
];

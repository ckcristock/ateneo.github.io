import { Routes } from '@angular/router';
import { CuentasBancariasComponent } from './cuentas-bancarias/cuentas-bancarias.component';
import { AgendamientoComponent } from './agendamiento/agendamiento.component';
import { NominaComponent } from './nomina/nomina.component';
import { VacantesComponent } from './vacantes/vacantes.component';
import { ViaticosComponent } from './viaticos/viaticos.component';
import { TercerosComponent } from './terceros/terceros.component';
import { TurneroComponent } from './turnero/turnero.component';
import { CategoriasComponent } from '../informacion-base/empresas/company-configuration/components/categorias/categorias.component';
import { SubcategoriasComponent } from '../informacion-base/empresas/company-configuration/components/subcategorias/subcategorias.component';
import { UnidadesMedidasComponent } from './unidades-medidas/unidades-medidas.component';

export const routes: Routes = [
  { path: 'nomina', component: NominaComponent },
  { path: 'cuentas-bancarias', component: CuentasBancariasComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'subcategorias', component: SubcategoriasComponent },
  { path: 'agendamiento', component: AgendamientoComponent },
  { path: 'vacantes', component: VacantesComponent },
  { path: 'viaticos', component: ViaticosComponent },
  { path: 'terceros', component: TercerosComponent },
  { path: 'turneros', component: TurneroComponent },
  { path: 'unidades-medidas', component: UnidadesMedidasComponent },
];

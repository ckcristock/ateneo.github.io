import { Routes } from '@angular/router';

import { CaracterizacionComponent } from './caracterizacion/caracterizacion.component';
import { KardexPatologiaComponent } from './kardex-patologia/kardex-patologia.component';
import { LaboratoryComponent } from './laboratory/laboratory.component';
import { NewLaboratoryComponent } from './laboratory/new-laboratory/new-laboratory.component';
import { ViewLaboratoryComponent } from './laboratory/view-laboratory/view-laboratory.component';
import { VariableHightCostComponent } from './variable-hight-cost/variable-hight-cost.component';

export const routes: Routes = [
  { path: 'caracterizacion', component: CaracterizacionComponent },
  { path: 'kardex-patologia', component: KardexPatologiaComponent },
  { path: 'laboratorio', component: LaboratoryComponent },
  { path: 'laboratorio/nuevo-laboratorio', component: NewLaboratoryComponent },
  { path: 'laboratorio/ver-laboratorio/:id', component: ViewLaboratoryComponent },
  {
    path: 'historia-clinica',
    loadChildren: () => import('./clinical-history/clinical-history.routes').then((m) => m.routes),
  },
  {
    path: 'administracion-historia-clinica',
    loadChildren: () =>
      import('./managment-clinical-history/managment-clinical-history.routes').then(
        (m) => m.routes,
      ),
  },
  { path: 'variables-hight-cost', component: VariableHightCostComponent },
];

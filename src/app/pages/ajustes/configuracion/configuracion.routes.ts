import { Routes } from '@angular/router';
import { LocalidadesComponent } from './localidades/localidades.component';
import { CamposTercerosComponent } from '../informacion-base/terceros/campos-terceros/campos-terceros.component';
import { ConsecutivosComponent } from './consecutivos/consecutivos.component';
import { FormatoHistoriaComponent } from './formato-historia/formato-historia.component';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';
import { CompanyConfigurationComponent } from '../informacion-base/empresas/company-configuration/company-configuration.component';
import { HistoryModelsComponent } from './history-models/history-models.component';
import { HistoryModelCreateComponent } from './history-models/history-model-create/history-model-create.component';
import { HistoryModelViewComponent } from './history-models/history-model-view/history-model-view.component';

export const routes: Routes = [
  { path: 'configuracion-empresa/:id/:value', component: CompanyConfigurationComponent },
  { path: 'campos-terceros', component: CamposTercerosComponent },
  { path: 'formato-historia', component: FormatoHistoriaComponent },
  {
    path: 'contabilidad',
    redirectTo: 'contabilidad/category',
  },
  { path: 'contabilidad/:value', component: ContabilidadComponent },
  { path: 'ubicaciones', component: LocalidadesComponent },
  { path: 'consecutivos', component: ConsecutivosComponent },
  { path: 'modelos-historia-clinica', component: HistoryModelsComponent },
  { path: 'modelos-historia-clinica/crear', component: HistoryModelCreateComponent },
  { path: 'modelos-historia-clinica/ver/:id', component: HistoryModelViewComponent },
];

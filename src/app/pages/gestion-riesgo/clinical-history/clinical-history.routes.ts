import { Routes } from '@angular/router';
import { ClinicalHistoryComponent } from './clinical-history.component';
import { DeepDetailComponent } from './deep-detail/deep-detail.component';
import { NewClinicalHistoryComponent } from './new-clinical-history/new-clinical-history.component';

export const routes: Routes = [
  {
    path: '',
    component: ClinicalHistoryComponent,
  },
  {
    path: 'deep-detail/:id',
    component: DeepDetailComponent,
  },
  {
    path: 'nueva-historia-clinica/:id',
    component: NewClinicalHistoryComponent,
  },
];

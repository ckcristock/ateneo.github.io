import { Routes } from '@angular/router';
import { ModalComponent } from './persons/modal/modal.component';
import { PersonsComponent } from './persons/persons.component';

export const routes: Routes = [
  {
    path: '',
    component: PersonsComponent,
  },
  {
    path: 'create',
    component: ModalComponent,
  },
];

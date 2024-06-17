import { Routes } from '@angular/router';
import { RemisionesComponent } from './remisiones.component';
import { RemisioncrearnuevoComponent } from './remisioncrearnuevo/remisioncrearnuevo.component';
import { RemisioneditarComponent } from './remisioneditar/remisioneditar.component';
import { RemisionComponent } from './remision/remision.component';

export const routes: Routes = [
  { path: '', component: RemisionesComponent },
  { path: 'remisioncrearnuevo', component: RemisioncrearnuevoComponent },
  { path: 'remision/:id', component: RemisionComponent },
  { path: 'remisioneditar/:id', component: RemisioneditarComponent },
];

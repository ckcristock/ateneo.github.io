import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'asistencia', component: AsistenciaComponent },
];

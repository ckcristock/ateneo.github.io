import { Routes } from '@angular/router';
import { MediomagneticoagrupacioncrearComponent } from './mediosmagneticos/mediomagagrupadosesp/mediomagneticoagrupacioncrear/mediomagneticoagrupacioncrear.component';
import { MediosmagneticosComponent } from './mediosmagneticos/mediosmagneticos.component';
import { MediomagneticocrearComponent } from './mediosmagneticos/mediomagneticocrear/mediomagneticocrear.component';
import { MediomagagrupadosespComponent } from './mediosmagneticos/mediomagagrupadosesp/mediomagagrupadosesp.component';
import { CertificadoretencionComponent } from './certificadoretencion/certificadoretencion.component';
import { CertificadoingresoyretencionComponent } from './certificadoingresoyretencion/certificadoingresoyretencion.component';
import { ResumenretencionesComponent } from './resumenretenciones/resumenretenciones.component';

export const routes: Routes = [
  { path: 'mediosmagneticosespeciales', component: MediosmagneticosComponent },
  { path: 'mediosmagneticos', component: MediosmagneticosComponent },
  { path: 'medios-magneticos/crear', component: MediomagneticocrearComponent },
  { path: 'medios-magneticos/editar/:id', component: MediomagneticocrearComponent },
  { path: 'medios-magneticosespeciales/crear', component: MediomagneticocrearComponent },
  { path: 'medios-magneticosespeciales/editar/:id', component: MediomagneticocrearComponent },
  { path: 'agruparmediosmagneticos', component: MediomagagrupadosespComponent },
  { path: 'agruparmediosmagneticos/crear', component: MediomagneticoagrupacioncrearComponent },
  { path: 'agruparmediosmagneticos/editar/:id', component: MediomagneticoagrupacioncrearComponent },

  { path: 'certificadoretencion', component: CertificadoretencionComponent },
  { path: 'certificadoingresoyretencion', component: CertificadoingresoyretencionComponent },
  { path: 'resumenretenciones', component: ResumenretencionesComponent },
];

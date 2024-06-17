import { Routes } from '@angular/router';
import { TiposRiesgoComponent } from './tipos-riesgo/tipos-riesgo.component';
import { TiposNovedadesComponent } from './tipos-novedades/tipos-novedades.component';
import { TiposEgresoComponent } from './tipos-egreso/tipos-egreso.component';
import { TiposIngresoComponent } from './tipos-ingreso/tipos-ingreso.component';
import { TiposRetencionesComponent } from './tipos-retenciones/tipos-retenciones.component';
import { ContratoComponent } from '../parametros/contrato/contrato.component';
import { TiposActivoFijoComponent } from '../../contabilidad/activos-fijos/tipos-activo-fijo/tipos-activo-fijo.component';
import { TiposerviciosComponent } from './tiposervicios/tiposervicios.component';
import { TiposervicioscrearComponent } from './tiposervicios/tiposervicioscrear/tiposervicioscrear.component';

export const routes: Routes = [
  { path: 'contrato', component: ContratoComponent },
  { path: 'tipos-riesgo', component: TiposRiesgoComponent },
  { path: 'tipos-novedad', component: TiposNovedadesComponent },
  { path: 'tipos-egreso', component: TiposEgresoComponent },
  { path: 'tipos-ingreso', component: TiposIngresoComponent },
  { path: 'tipos-activo-fijo', component: TiposActivoFijoComponent },
  { path: 'tipos-retenciones', component: TiposRetencionesComponent },
  { path: 'tipos-servicio', component: TiposerviciosComponent },
  { path: 'tipos-servicio/crear/:id_tipo_servicio', component: TiposervicioscrearComponent },
];

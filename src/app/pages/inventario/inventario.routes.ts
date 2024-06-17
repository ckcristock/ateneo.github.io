import { Routes } from '@angular/router';
import { InventarioFisicoComponent } from './inventario-fisico/inventario-fisico.component';
import { InventarioComponent } from './inventario/inventario.component';
import { ActaRecepcionComponent } from './acta-recepcion/acta-recepcion.component';
import { CrearActaRecepcionComponent } from './acta-recepcion/crear-acta-recepcion/crear-acta-recepcion.component';
import { VerActaRecepcionComponent } from './acta-recepcion/ver-acta-recepcion/ver-acta-recepcion.component';
import { AcomodarActaComponent } from './approved-receiving-minutes/acomodar-acta/acomodar-acta.component';
import { InventarioVencerComponent } from './inventario-vencer/inventario-vencer.component';
import { AlistamientoComponent } from './alistamiento/alistamiento.component';
import { InventarioEstibasComponent } from './inventario-fisico/inventario-estibas/inventario-estibas.component';
import { ActarecepcioncrearComponent } from './return-purchases/components/pending-return/components/actarecepcioncrear/actarecepcioncrear.component';
import { VerdevolucionescomprasComponent } from './return-purchases/components/pending-return/components/verdevolucionescompras/verdevolucionescompras.component';
import { VerdetalledevolucionComponent } from './return-purchases/components/return-made/components/verdetalledevolucion/verdetalledevolucion.component';
import { AjusteunoaunoComponent } from './ajusteunoauno/ajusteunoauno.component';
import { AjustesinventarioverComponent } from './ajusteunoauno/ajustesinventariover/ajustesinventariover.component';
import { AjusteunoaunocrearComponent } from './ajusteunoauno/ajusteunoaunocrear/ajusteunoaunocrear.component';
import { InventariopuntosComponent } from './inventariopuntos/inventariopuntos.component';
import { ActarecepcionremisionesnuevoComponent } from './actarecepcionremisionesnuevo/actarecepcionremisionesnuevo.component';
import { ActarecepcionremisionverComponent } from './actarecepcionremisionesnuevo/actarecepcionremisionver/actarecepcionremisionver.component';
import { ListadoinventariospuntosComponent } from './listadoinventariospuntos/listadoinventariospuntos.component';
import { VerinventariopuntosComponent } from './listadoinventariospuntos/verinventariopuntos/verinventariopuntos.component';
import { ApprovedReceivingMinutesComponent } from './approved-receiving-minutes/approved-receiving-minutes.component';
import { ReturnPurchasesComponent } from './return-purchases/return-purchases.component';
import { AddReturnPurchasesComponent } from './return-purchases/components/return-made/components/add-return-purchases/add-return-purchases.component';
import { ViewInvoiceSalesComponent } from './inventario/components/view-invoice-sales/view-invoice-sales.component';
import { ExpirationsComponent } from './expirations/expirations.component';
import { ActarecepcionremisionnuevoComponent } from './actarecepcionremisionesnuevo/actarecepcionremisionnuevo/actarecepcionremisionnuevo.component';
import { AlistamientocrearComponent } from './alistamiento/alistamientocrear/alistamientocrear.component';
import { VerInventarioComponent } from './inventario-fisico/ver-inventario/ver-inventario.component';
import { AjusteDocumentosAuditablesComponent } from './inventario-fisico/ajuste-documentos-auditables/ajuste-documentos-auditables.component';
import { AjustedocumentosComponent } from './inventario-fisico/ajustedocumentos/ajustedocumentos.component';
import { ReconteoEstibaComponent } from 'src/app/pages/inventario/inventario-fisico/reconteo-estiba/reconteo-estiba.component';
import { InventarioReconteoComponent } from './inventario-fisico/inventario-reconteo/inventario-reconteo.component';
export const routes: Routes = [
  {
    path: 'remisiones',
    loadChildren: () => import('./remision/remision.routes').then((m) => m.routes),
  },
  { path: 'inventario', component: InventarioComponent },
  { path: 'inventario-fisico', component: InventarioFisicoComponent },
  { path: 'acta-recepcion', component: ActaRecepcionComponent },
  { path: 'acta-recepcion/crear/:id/:compra', component: CrearActaRecepcionComponent },
  { path: 'acta-recepcion/editar/:id/:compra', component: CrearActaRecepcionComponent },
  { path: 'acta-recepcion/ver/:id', component: VerActaRecepcionComponent },
  { path: 'acta-recepcion-aprobadas', component: ApprovedReceivingMinutesComponent },
  { path: 'acta-recepcion-acomodar/:tipo/:id/:lugar/:idLugar', component: AcomodarActaComponent },
  { path: 'vencer', component: InventarioVencerComponent },
  { path: 'inventario-estibas/:id', component: InventarioEstibasComponent },
  { path: 'alistamiento', component: AlistamientoComponent },
  { path: 'alistamiento/crear/:id/:tipo/:idc', component: AlistamientocrearComponent },
  { path: 'devoluciones/revertir/:codigo/:compra', component: ActarecepcioncrearComponent },
  { path: 'devoluciones/vernoconformidad/:id', component: VerdevolucionescomprasComponent },
  { path: 'devoluciones/verdetalledevolucion/:id', component: VerdetalledevolucionComponent },
  { path: 'devoluciones', component: ReturnPurchasesComponent },
  { path: 'devoluciones/crear', component: AddReturnPurchasesComponent },
  { path: 'ajuste-individual', component: AjusteunoaunoComponent },
  { path: 'ajuste-individual/ver/:id', component: AjustesinventarioverComponent },
  { path: 'ajuste-individual/crear', component: AjusteunoaunocrearComponent },
  { path: 'ajustedocumentosauditables/:idBodega', component: AjusteDocumentosAuditablesComponent },
  { path: 'ajuste-documentos/:idEstiba', component: AjustedocumentosComponent },
  { path: 'inventario-puntos', component: InventariopuntosComponent },
  { path: 'inventario-fisico-puntos', component: ListadoinventariospuntosComponent },
  { path: 'inventario-fisico-puntos/ver/:idInventario', component: VerinventariopuntosComponent },
  { path: 'ver-factura-venta/:id', component: ViewInvoiceSalesComponent },
  { path: 'inventariofisicoestibas/:inventoryId', component: VerInventarioComponent },
  { path: 'reconteo-estiba/:idInventarioEstiba', component: ReconteoEstibaComponent },
  { path: 'reconteo-personalizado/:idInventarioEstiba', component: InventarioReconteoComponent },
  { path: 'vencimientos', component: ExpirationsComponent },
  { path: 'acta-recepcion-remisiones', component: ActarecepcionremisionesnuevoComponent },
  { path: 'acta-recepcion-remisiones/:id', component: ActarecepcionremisionverComponent },
  { path: 'acta-recepcion-remisiones/:codigo/:id', component: ActarecepcionremisionnuevoComponent },
];

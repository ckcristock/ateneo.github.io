import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventariofisicoService {
  globales = environment;

  constructor(private client: HttpClient) {}

  public IniciarInventario(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/iniciar_inventario_barrido.php',
      { params: p },
    );
  }

  public GetInventarioFisico(idInventario: string): Observable<any> {
    let p = { id_inventario: idInventario };
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/get_inventario_iniciado.php',
      { params: p },
    );
  }

  public GetProducto(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/consulta_producto_barrido.php',
      { params: p },
    );
  }

  public saveLote(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/agrega_productos_barrido.php',
      data,
    );
  }
  public AjustarInventario(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/ajustar_inventario.php',
      data,
    );
  }

  public ValidarInventario(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/validar_inventario.php?inv=' + p,
    );
  }

  public GetProductosSinDiferencia(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/inventario_sin_diferencia_barrido.php?inv=' + p,
    );
  }

  public SaveInventarioFinal(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/guardar_inventario_final_barrido.php',
      data,
    );
  }
  public DescargarInforme(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/descargar_excel_diferencias.php',
      data,
    );
  }

  /**
   * Nuevo modelo
   */

  public GetProductoEstiba(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/estiba/consulta_producto.php',
      { params: p },
    );
  }

  public SaveLoteEstiba(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/estiba/agrega_productos.php',
      data,
    );
  }
  public SaveLoteEstibaPunto(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/agrega_productos.php',
      data,
    );
  }
  public GestionarEstado(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/estiba/gestion_de_estado.php',
      data,
    );
  }
  public GestionarEstado_Custom(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventario_auditor/gestion_estado_custom.php',
      data,
    );
  }

  public GestionarEstadoPunto(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/gestion_de_estado.php',
      data,
    );
  }

  public GetDocumentosIniciados(): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/estiba/documentos_iniciados.php',
    );
  }
  public GetDocumentosIniciadosPuntos(): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/documentos_iniciados.php',
    );
  }
  public GetDocumentosTerminados(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/estiba/documentos_terminados.php',
      { params: p },
    );
  }
  public GetDocumentosTerminadosPunto(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/documentos_terminados.php',
      { params: p },
    );
  }
  public GetInventario(p: any): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/inventariofisico/estiba/get_inventario.php', {
      params: p,
    });
  }

  public GetInventarioPunto(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/get_inventario.php',
      { params: p },
    );
  }

  public SaveReconteo(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/estiba/guardar_reconteo.php',
      data,
    );
  }

  public SaveReconteoAuditor(data: FormData): Observable<any> {
    return this.client.post(this.globales.ruta + 'php/inventario_auditor/save_reconteo.php', data);
  }

  public SaveReconteoPunto(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/guardar_reconteo.php',
      data,
    );
  }

  public GetDocumentosParaAjustar(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/estiba/documentos_para_ajustar.php',
      { params: p },
    );
  }

  public GetDocumentosParaAjustarAuditables(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventario_auditor/documentos_para_ajustar_auditables.php',
      { params: p },
    );
  }

  public GetDocumentosParaAjustarPunto(p: any): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/documentos_para_ajustar.php',
      { params: p },
    );
  }

  public SaveInventarioFinalEstiba(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/estiba/guardar_inventario_final.php',
      data,
    );
  }

  public SaveInventarioFinalEstibaAuditor(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventario_auditor/guardar_inventario_final.php',
      data,
    );
  }
  public SaveInventarioFinalEstibaPunto(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/guardar_inventario_final.php',
      data,
    );
  }

  public ValidarInventarioEstiba(p: string): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisico/estiba/validar_inventario.php?inv=' + p,
    );
  }

  public ValidarInventarioAuditable(p: string): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/inventario_auditor/reconteo.php?inv=' + p);
  }

  public ValidarInventarioEstibaPuntos(p: string): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/validar_inventario.php?inv=' + p,
    );
  }

  public getInventarioFisicoTerminado(p: string): Observable<any> {
    return this.client.get(
      this.globales.ruta +
        'php/inventariofisico/estiba/ver_inventario_terminado.php?Id_Inventario_Fisico_Nuevo=' +
        p,
    );
  }
  public getInventarioAuditableTerminado(p: string): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/inventario_auditor/show_inventario_Terminado.php?Id=' + p,
    );
  }
  public getInventarioFisicoTerminadoPunto(p: string): Observable<any> {
    return this.client.get(
      this.globales.ruta +
        'php/inventariofisicopuntos/estiba/ver_inventario_terminado.php?Id_Inventario_Fisico_Punto_Nuevo=' +
        p,
    );
  }

  public DescargarInformeEstiba(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/estiba/descargar_excel_diferencias.php',
      data,
    );
  }

  public AjustarInventarioEstiba(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisico/estiba/ajustar_inventario.php',
      data,
    );
  }
  public AjustarInventarioEstibaPuntos(data: FormData): Observable<any> {
    return this.client.post(
      this.globales.ruta + 'php/inventariofisicopuntos/estiba/ajustar_inventario.php',
      data,
    );
  }
}

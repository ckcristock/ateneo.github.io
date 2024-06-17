import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RemisionnuevoService {
  private _rutaProductosRemision: string = environment.ruta + 'php/remision_nuevo';

  constructor(private client: HttpClient) {}

  // public GetDatosIniciales(p: any): Observable<any> {
  //   return this.client.get(
  //     // environment.ruta +
  //     'php/remision_nuevo/get_datos_iniciales.php'
  //     , { params: p }
  //   );
  // }

  // public GetDatosInicialesDispensacion(p: any): Observable<any> {
  //   let data = new FormData();
  //   data.append('id', p)
  //   return this.client.post(environment.ruta + 'php/dispensacion_despacho/detailDispensacion.php', data);
  // }

  // public GetCategoriaPorBodega(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/categoria_nueva/get_categorias_por_bodega.php', { params: p });
  // }

  // public GetGruposPorBodega(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/grupo_estiba/get_grupos_bodega.php', { params: p });
  // }

  // public GetListaProductosRemision(p: any): Observable<any> {
  //   return this.client.get(this._rutaProductosRemision + 'get_productos_inventario.php', { params: p });
  // }

  // public GetListaProductosDispensacion(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/dispensacion_despacho/getListaProductos.php', { params: p });
  // }

  // public GuardarLotesSeleccionados(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision_nuevo/seleccionar_lotes_inventario.php', data);
  // }

  // public EliminarLotesSeleccionados(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision_nuevo/eliminar_lote_seleccionado.php', data);
  // }

  // public ComprobarCantidades(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision_nuevo/comprobar_cantidades.php', { params: p });
  // }

  // public GetProductosPendientes(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision_nuevo/get_pendientes.php', { params: p });
  // }

  // public EliminarLotesMasivos(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision_nuevo/eliminar_lotes_masivos.php', data);
  // }

  // //---------

  // public GetImpuestos(): Observable<any> {
  //   return this.client.get(environment.base_url + '/php/lista_generales.php', { params: { modulo: 'Impuesto' } });
  // }

  // public GetBorrador(codigo: string): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision_nuevo/get_borrador.php', { params: { codigo: codigo } });
  // }

  // public GetRotativo(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision_nuevo/get_rotativo.php', { params: p });
  // }

  // public GetRotativoNoPos(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision_nuevo/get_rotativo_no_pos.php', { params: p });
  // }

  // public GuardarBorrador(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision_nuevo/guardar_borrador.php', data);
  // }

  // public RealizarCambioProducto(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision_nuevo/guardar_cambio_producto.php', data);
  // }

  // public GuardarRemision(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision_nuevo/save_remision.php', data);
  // }

  // public GuardarRemisionDevolucion(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision_nuevo/save_remision_devolucion.php', data);
  // }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RemisionService {
  constructor(private client: HttpClient) {
    // private globales: Globales
  }

  // public GetDatosIniciales(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision/get_datos_iniciales.php', { params: p });
  // }

  // public GetProductosPendientes(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision/get_pendientes.php', { params: p });
  // }

  // public GetImpuestos(): Observable<any> {
  //   return this.client.get(environment.base_url + '/php/lista_generales.php', { params: { modulo: 'Impuesto' } });
  // }

  // public GetBorrador(codigo: string): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision/get_borrador.php', { params: { codigo: codigo } });
  // }

  // public GetRotativo(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision/get_rotativo.php', { params: p });
  // }

  // public GetRotativoNoPos(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision/get_rotativo_no_pos.php', { params: p });
  // }

  // public ComprobarCantidades(p: any): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/remision/comprobar_cantidades.php', { params: p });
  // }

  // public GuardarLotesSeleccionados(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision/seleccionar_lotes_inventario.php', data);
  // }

  // public EliminarLotesSeleccionados(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision/eliminar_lote_seleccionado.php', data);
  // }

  // public GuardarBorrador(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision/guardar_borrador.php', data);
  // }

  // public RealizarCambioProducto(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision/guardar_cambio_producto.php', data);
  // }

  // public EliminarLotesMasivos(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision/eliminar_lotes_masivos.php', data);
  // }

  // public GuardarRemision(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision/save_remision.php', data);
  // }

  // public GuardarRemisionDevolucion(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/remision/save_remision_devolucion.php', data);
  // }
}

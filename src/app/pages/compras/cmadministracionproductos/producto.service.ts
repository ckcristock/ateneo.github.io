import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  globales = environment;

  private _rutaBase: string = this.globales.ruta + 'php/GENERALES/productos/';
  private _rutaProductos: string = this.globales.ruta + 'php/productos/productosasociados/';
  private _rutaProductosControl: string =
    this.globales.ruta + 'php/productos/productoscontrolados/';
  private _rutaProductosRemision: string = this.globales.ruta + 'php/remision/';

  constructor(private client: HttpClient) {}

  getListaProductos(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_lista_productos.php', { params: p });
  }

  GetProductosFiltrar(): Observable<any> {
    return this.client.get(this._rutaProductos + 'get_productos_filtrar.php');
  }

  public GetDetalleAsociado(idAsociado: string): Observable<any> {
    let p = { id_producto_asociado: idAsociado };
    return this.client.get(this._rutaProductos + 'get_detalle_productos_asociados.php', {
      params: p,
    });
  }

  public GetDetalleControlado(idControlado: string): Observable<any> {
    let p = { id_producto_controlado: idControlado };
    return this.client.get(this._rutaProductosControl + 'get_detalle_producto_controlado.php', {
      params: p,
    });
  }

  GetListaProductosAsociados(p: any): Observable<any> {
    return this.client.get(this._rutaProductos + 'get_lista_productos_asociados.php', {
      params: p,
    });
  }

  GetListaProductosControlados(p: any): Observable<any> {
    return this.client.get(this._rutaProductosControl + 'get_lista_productos_controlados.php', {
      params: p,
    });
  }

  public GuardarProductosAsociados(data: FormData): Observable<any> {
    return this.client.post(this._rutaProductos + 'guardar_productos_asociados.php', data);
  }

  public GuardarProductosControlado(data: FormData): Observable<any> {
    return this.client.post(this._rutaProductosControl + 'guardar_producto_controlado.php', data);
  }

  public ActualizarProductosAsociados(data: FormData): Observable<any> {
    return this.client.post(this._rutaProductos + 'editar_productos_asociados.php', data);
  }

  public ActualizarProductoControlado(data: FormData): Observable<any> {
    return this.client.post(
      this._rutaProductosControl + 'actualizar_producto_controlado.php',
      data,
    );
  }

  public EliminarControl(data: FormData): Observable<any> {
    return this.client.post(this._rutaProductosControl + 'eliminar_producto_controlado.php', data);
  }

  public GetListaProductosRemision(p: any): Observable<any> {
    return this.client.get(this._rutaProductosRemision + 'get_productos_inventario.php', {
      params: p,
    });
  }
}

export class ProductoRemisionModel {
  private _Id_Producto_Remision: number = 0;
  private _Id_Remision: number = 0;
  private _Id_Inventario: number = 0;
  private _Lote: string = '';
  private _Fecha_Vencimiento: string = '';
  private _Cantidad: number = 0;
  private _Id_Producto: number = 0;
  private _Nombre_Producto: string = '';
  private _Cantidad_Total: number = 0;
  private _Precio: number = 0;
  private _Descuento: number = 0;
  private _Impuesto: number = 0;
  private _Subtotal: number = 0;
  private _Total_Descuento: number = 0;
  private _Total_Impuesto: number = 0;
  private _lotes: Array<any> = [];

  //GETTERS
  public get Id_Producto_Remision(): number {
    return this._Id_Producto_Remision;
  }

  public get Id_Remision(): number {
    return this._Id_Remision;
  }

  public get Id_Inventario(): number {
    return this._Id_Inventario;
  }

  public get Lote(): string {
    return this._Lote;
  }

  public get Fecha_Vencimiento(): string {
    return this._Fecha_Vencimiento;
  }

  public get Cantidad(): number {
    return this._Cantidad;
  }

  public get Id_Producto(): number {
    return this._Id_Producto;
  }

  public get Nombre_Producto(): string {
    return this._Nombre_Producto;
  }

  public get Cantidad_Total(): number {
    return this._Cantidad_Total;
  }

  public get Precio(): number {
    return this._Precio;
  }

  public get Descuento(): number {
    return this._Descuento;
  }

  public get Impuesto(): number {
    return this._Impuesto;
  }

  public get Subtotal(): number {
    return this._Subtotal;
  }

  public get Total_Descuento(): number {
    return this._Total_Descuento;
  }

  public get Total_Impuesto(): number {
    return this._Total_Impuesto;
  }

  public get Lotes(): Array<any> {
    return this._lotes;
  }

  //SETTERS
  public set Id_Producto_Remision(value: number) {
    this._Id_Producto_Remision = value;
  }

  public set Id_Remision(value: number) {
    this._Id_Remision = value;
  }

  public set Id_Inventario(value: number) {
    this._Id_Inventario = value;
  }

  public set Lote(value: string) {
    this._Lote = value;
  }

  public set Fecha_Vencimiento(value: string) {
    this._Fecha_Vencimiento = value;
  }

  public set Cantidad(value: number) {
    if (value == null || value == undefined) {
      this._Cantidad = 0;
    } else {
      this._Cantidad = value;
    }
  }

  public set Id_Producto(value: number) {
    this._Id_Producto = value;
  }
  public set Nombre_Producto(value: string) {
    this._Nombre_Producto = value;
  }

  public set Cantidad_Total(value: number) {
    try {
      if (value == null || value == undefined) {
        this._Cantidad_Total = 0;
      } else {
        this._Cantidad_Total = value;
      }
    } catch (error) {
    } finally {
      this.CalcularTotalProducto();
    }
  }

  public set Precio(value: number) {
    try {
      if (value == null || value == undefined) {
        this._Precio = 0;
      } else {
        this._Precio = value;
      }
    } catch (error) {
    } finally {
      this.CalcularTotalProducto();
    }
  }

  public set Descuento(value: number) {
    if (value == null || value == undefined) {
      this._Descuento = 0;
    } else {
      this._Descuento = value;
    }
  }

  public set Impuesto(value: number) {
    if (value == null || value == undefined) {
      this._Impuesto = 0;
    } else {
      this._Impuesto = value;
    }
  }

  public set Subtotal(value: number) {
    if (value == null || value == undefined) {
      this._Subtotal = 0;
    } else {
      this._Subtotal = value;
    }
  }

  public set Total_Descuento(value: number) {
    if (value == null || value == undefined) {
      this._Total_Descuento = 0;
    } else {
      this._Total_Descuento = value;
    }
  }

  public set Total_Impuesto(value: number) {
    if (value == null || value == undefined) {
      this._Total_Impuesto = 0;
    } else {
      this._Total_Impuesto = value;
    }
  }

  public set Lotes(value: Array<any>) {
    this._lotes = value;
  }

  private CalcularTotalProducto() {
    let total_sin_impuesto = this._Cantidad_Total * this._Precio;
    let descuento = total_sin_impuesto * this._Descuento;
    let subtotal = total_sin_impuesto + total_sin_impuesto * (this._Impuesto / 100) - descuento;
    this.Total_Descuento = descuento;
    this.Subtotal = subtotal;
  }
}

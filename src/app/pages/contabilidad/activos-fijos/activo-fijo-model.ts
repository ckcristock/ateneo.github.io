export class ActivoFijoModel {
  public company_id: any = '';
  public Id_Actividad: string = '';
  public Nombre: string = '';
  public Id_Tipo_Activo_Fijo: string = '';
  public Costo_NIIF: number = 0;
  public Costo_PCGA: number = 0;
  public Tipo_Activo: string = '';
  public Nit: string = '';
  public Nombre_Empresa: string = '';
  public Concepto: string = '';
  public Documento: string = '';
  public Referencia: string = '';
  public Codigo: string = '';
  public Cantidad: string = '';
  public Id_Centro_Costo: string = '';
  public Id_Cuenta_Cuenta_Por_Pagar: string = '';
  public Base: number = 0;
  public Iva: number = 0;
  public Base_NIIF: number = 0;
  public Iva_NIIF: number = 0;
  public Costo_Rete_Fuente: number = 0;
  public Costo_Rete_Fuente_NIIF: number = 0;
  public Id_Cuenta_Rete_Fuente: number = 0;
  public Costo_Rete_Ica: number = 0;
  public Costo_Rete_Ica_NIIF: number = 0;
  public Id_Cuenta_Rete_Ica: number = 0;
  public Tipo: string = '';
  public Tipo_Depreciacion: string = '';
  // public Identificacion_Funcionario:string=(JSON.parse(localStorage.getItem("User"))).Identificacion_Funcionario;
  public Identificacion_Funcionario: string = '1';
  public Centro_Costo: string = '';
  public Id_Activo_Fijo: string = '';
  public Nit_CtaPorPagar: string = '';
  public Documento_CtaPorPagar: string = '';
  public Valor_CtaPorPagar: number = 0;
  public Fecha: string = this.fechaHoy();
  public Detalles: string = '';

  private fechaHoy() {
    let fecha: any = new Date();
    fecha = fecha.toISOString().split('T')[0];

    return fecha;
  }
}

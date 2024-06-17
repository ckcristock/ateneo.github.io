interface GrupoT {
  Id_Grupo: number;
  Nombre_Grupo: string;
  Fecha_Vencimiento: string;
  Presentacion: string;
}
export class RemisionModelNuevo {
  public Tipo: string = 'Interna';
  public Prioridad: string = '1';
  public Meses: string = '4';
  public Modelo: string = 'Bodega-Bodega';
  public Nombre_Destino: string = '';
  public Nombre_Origen: string = '';
  public Identificacion_Funcionario: number = 0;
  public Observaciones: string = '';
  public Tipo_Origen: string = 'Bodega';
  public Tipo_Destino: string = 'Punto_Dispensacion';
  public Id_Origen: number = 0;
  public Id_Destino: number = 0;
  public Id_Contrato: number = 0;
  public Estado: string = 'Pendiente';
  public Estado_Alistamiento: string = '0';
  public Tipo_Pago: string = 'Credito';
  public Fecha: string = '';
  public Codigo: string = '';
  public Tipo_Lista: string = '';
  public Id_Lista: string = '';
  public Id_Factura: string = '';
  public Peso_Remision: string = '';
  public Codigo_Qr: string = '';
  public Costo_Remision: number = 0;
  public Tipo_Bodega: string = '';
  public Fecha_Anulacion: string = '';
  public Funcionario_Anula: string = '';
  public Fase_1: string = '';
  public Fase_2: string = '';
  public Guia: string = '';
  public Empresa_Envio: string = '';
  public Subtotal_Remision: number = 0;
  public Descuento_Remision: number = 0;
  public Impuesto_Remision: number = 0;
  public Orden_Compra: string = '';
  public Inicio_Fase1: string = '';
  public Fin_Fase1: string = '';
  public Inicio_Fase2: string = '';
  public Fin_Fase2: string = '';
  public Entrega_Pendientes: string = 'No';
  Category = '';

  public Grupo: GrupoT;
  public Tipo_;

  constructor(funcionarioCrea: number) {
    this.identificacionFuncionarioCrea = funcionarioCrea;
    let Grupo: any = {};
    Grupo.Id_Grupo = 0;
    Grupo.Nombre_Grupo = '';
    Grupo.Fecha_Vencimiento = '';
    Grupo.Presentacion = '';
    this.Grupo = Grupo;
  }

  public set identificacionFuncionarioCrea(value: number) {
    this.Identificacion_Funcionario = value;
  }

  public setGrupo(grupo: any) {
    this.Grupo.Id_Grupo = grupo.Id_Grupo;
    this.Grupo.Fecha_Vencimiento = grupo.Fecha_Vencimiento;
    this.Grupo.Nombre_Grupo = grupo.Nombre_Grupo;
    this.Grupo.Presentacion = grupo.Presentacion;
  }
}

export class CertificadoRetencionModel {
  public Fecha_Inicial: string;
  public Fecha_Final: string;
  public Cuenta_Inicial: string;
  public Cuenta_Final: string;
  public Nit: string;
  public Fecha_Expedicion: string = this.fechaHoy();
  public Cuentas: any = [];
  public Tipo_Nit: string;

  private fechaHoy() {
    let fecha: any = new Date();
    fecha = fecha.toISOString().split('T')[0];

    return fecha;
  }
}

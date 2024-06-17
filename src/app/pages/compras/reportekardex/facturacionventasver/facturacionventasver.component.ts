import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { ActividadComponent } from '../actividad/actividad.component';
import { NotascreditoverdefacturasComponent } from '../notascreditoverdefacturas/notascreditoverdefacturas.component';
import { NotDataSaComponent } from '@app/components/not-data-sa/not-data-sa.component';
import { Activity, ActivityComponent } from '@shared/components/activity/activity.component';
import { ReportekardexService } from '../services/reportekardex.service';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { UserService } from '@app/core/services/user.service';
import { User } from 'src/app/core/models/users.model';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-facturacionventasver',
  templateUrl: './facturacionventasver.component.html',
  styleUrls: ['./facturacionventasver.component.scss'],
  standalone: true,
  imports: [
    ActividadComponent,
    NgIf,
    NgFor,
    NotascreditoverdefacturasComponent,
    CurrencyPipe,
    DatePipe,
    NotDataSaComponent,
    ActivityComponent,
    CabeceraComponent,
  ],
})
export class FacturacionventasverComponent implements OnInit {
  public id = this.route.snapshot.params['id'];
  public detalles: any = [];
  public productos: any[] = [];
  public notasCredito: any[] = [];
  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer1 = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Descuento_Factura);
  public Subtotal: any = 0;
  public Total: any = 0;
  public TotalNC = 0;
  public valorLetra = '';
  public contadorNC: number = 0;
  public configuracionGeneral: any[] = [];
  public firmaUsuario: any = '';
  public impuesto: any = 0;
  public perfilUsuario = localStorage.getItem('miPerfil');
  public funcionario = JSON.parse(localStorage.getItem('User'));
  public resolucion: any = {};

  public Actividades: any = [];

  globales = environment;
  public datosCabecera = {
    Titulo: '',
    Fecha: '',
    Codigo: '',
  };
  public user!: User;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private reportekardexService: ReportekardexService,
    private _user: UserService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit() {
    this.http
      .get(this.globales.base_url + '/php/facturasventas/detalle_factura_venta.php', {
        params: { id: this.id },
      })
      .subscribe((data: any) => {
        this.detalles = data.Datos;
        this.resolucion = data.resolucion;
        this.productos = data.Productos;
        this.getVariablesKeys();
        //this.notasCredito = data.NotasCredito;
        this.Subtotal = data.TotalFc.TotalFac;
        this.TotalNC = data.TotalNc.TotalNC;
        this.valorLetra = data.letra;
        this.impuesto = data.TotalFc.Iva;

        this.Total = parseFloat(this.impuesto) + parseFloat(this.Subtotal);

        this.Actividades = data.activities;
        this.datosCabecera = {
          Titulo: ` Factura
                        ${
                          this.resolucion.Tipo_Resolucion == 'Resolucion_Electronica'
                            ? 'Electrónica'
                            : ''
                        }
                        de Venta`,
          Fecha: `${this.detalles.Fecha || ''}`,
          Codigo: `Código: ${this.detalles.Codigo}`,
        };
        //this.contadorNC = this.notasCredito.length;
      });

    this.user = this._user.user;
    this.firmaUsuario = this.user?.person['full_names'];
  }

  variablesKeys: string[] = [];

  getVariablesKeys() {
    if (this.productos.length > 0) {
      const firstItemWithVariables = this.productos.find((item) => item.variables);
      if (firstItemWithVariables && firstItemWithVariables.variables) {
        this.variablesKeys = Object.keys(firstItemWithVariables.variables);
      }
    }
  }

  downloadInvoice(Id_Factura_Venta) {
    const request = (resolve: any) => {
      this.reportekardexService.downloadInvoice(Id_Factura_Venta).subscribe({
        next: (response: BlobPart) => {
          let blob = new Blob([response], { type: 'application/pdf' });
          let link = document.createElement('a');
          const filename =
            'factura-venta-' + Id_Factura_Venta + this.reportekardexService.currentDateTime();
          link.href = window.URL.createObjectURL(blob);
          link.download = `${filename}.pdf`;
          link.click();
          resolve(true);
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
          if (error.error.error) {
            errorMessage = error.error.error;
            this.swalService.hardError();
          } else if (error.error.errors) {
            let errorMessages: string[] = [];
            for (const field in error.error.errors) {
              errorMessages.push(error.error.errors[field]);
            }
            const formattedErrorMessage = errorMessages.join('<br/>');
            this.swalService.incompleteError(formattedErrorMessage);
          }
        },
      });
    };
    this.swalService.swalLoading('Vamos a descargar la factura', request);
  }
}

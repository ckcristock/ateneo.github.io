import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe, DatePipe } from '@angular/common';
import { PuntosPipe } from '../../../core/pipes/puntos';
import { MatRadioModule } from '@angular/material/radio';
import { AutomaticSearchComponent } from '../../../shared/components/automatic-search/automatic-search.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { RouterLink } from '@angular/router';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ReportekardexService } from './services/reportekardex.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-reportekardex',
  templateUrl: './reportekardex.component.html',
  styleUrls: ['./reportekardex.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    TableComponent,
    RouterLink,
    ModalComponent,
    AutomaticSearchComponent,
    MatRadioModule,
    PuntosPipe,
    DecimalPipe,
    DatePipe,
  ],
})
export class ReportekardexComponent implements OnInit {
  myDateRangePickerOptions: any = {
    width: '390px',
    height: '20px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '11px',
    dateFormat: 'yyyy-mm-dd',
  };

  public bodega_punto: any = [];
  public bodegaPunto: string = '';
  public fecha: any = new Date();
  filtro_lab_com: string = '';
  filtro_lab_gen: string = '';
  Cargando: boolean = false;
  ListaProducto: any[] = [];
  filtro_nombre: string = '';
  filtro_Codigo_barras: string = '';
  filtro_cum: string = '';
  filtro_lote: string = '';
  filtro_fecha_fin: string = '';
  filtro_fecha_inicio: string = '';
  filtro_fecha: any = '';
  dia = new Date().toISOString().split('T')[0];
  Lista_Productos: any[] = [];
  ProductoConsulta = {};
  Cargando2 = false;
  inicial = 0;
  contador = 0;
  public query = '';
  public Saldo_Actual: any = 0;
  @ViewChild('modalProductos') modalProductos: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  typeWinery = 'Bodega';

  globales = environment;

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  constructor(
    private http: HttpClient,
    private readonly modalService: NgbModal,
    private reportekardexService: ReportekardexService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit() {
    this.http
      .get(this.globales.base_url + '/php/reportekardex/bodega_punto.php', {
        params: { bod: 'band' },
      })
      .subscribe((data: any) => {
        this.bodega_punto = data;
      });
    this.AgregarFechas();
  }

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.filtro_fecha_inicio = formatDate(this.formRange.value.start as string);
    this.filtro_fecha_fin = formatDate(this.formRange.value.end as string);
  }

  openGetProduct(modal: any): void {
    this.selectedProduct = false;
    this.modalService.open(modal, { size: 'lg' });
  }

  AgregarFechas() {
    let dia = new Date();
    let mes = dia.getMonth();
    let anio = dia.getFullYear();
    let fecha = mes <= 9 ? '0' + mes : mes;
    this.filtro_fecha_inicio = anio + '-' + fecha;

    this.filtro_fecha_fin = dia.toISOString().split('T')[0];
  }

  loadBodegaPunto(tipo) {
    this.typeWinery = tipo;
    if (tipo == 'Bodega') {
      let params: any = {
        bod: true,
      };
      this.http
        .get(this.globales.base_url + '/php/reportekardex/bodega_punto.php', { params: params })
        .subscribe((data: any) => {
          this.bodega_punto = data;
        });
    } else {
      let params: any = {
        pto: true,
      };

      this.http
        .get(this.globales.base_url + '/php/reportekardex/bodega_punto.php', { params: params })
        .subscribe((data: any) => {
          this.bodega_punto = data;
        });
    }
  }
  ValidarFecha() {
    let dia = new Date();
    var fecha = dia.toISOString().split('T')[0];
    if (this.filtro_fecha_fin > fecha) {
      this.confirmacionSwal.title = 'Error en la fecha ';
      this.confirmacionSwal.text = 'La fecha final no puede ser mayor a la fecha actual ';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
      this.filtro_fecha_fin = '';
    }
  }
  filtros() {
    let params: any = {};

    if (this.filtro_nombre != '' || this.filtro_Codigo_barras != '') {
      this.Cargando = true;
      if (this.filtro_nombre != '') {
        params.nom = this.filtro_nombre;
      }
      if (this.filtro_Codigo_barras != '') {
        params.codigo_barras = this.filtro_Codigo_barras;
      }
      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.http
        .get(this.globales.base_url + '/php/reportekardex/lista_productos.php?' + queryString)
        .subscribe((data: any) => {
          this.Cargando = false;
          this.ListaProducto = data;
        });
    } else {
      this.filtro_Codigo_barras = '';
      //this.Cargando = true;
      this.ListaProducto = [];
    }
  }
  selectedProduct: boolean = false;
  addProduct(i) {
    this.selectedProduct = true;
    this.ProductoConsulta = this.ListaProducto[i];
  }

  AgregarProducto() {
    this.selectedProduct = false;

    this.modalService.dismissAll();
    let tipo = this.typeWinery;
    // let IdBodegaPunto = (document.getElementById("IdBodegaPunto") as HTMLInputElement).value;
    let IdBodegaPunto = this.bodegaPunto;
    let fecha = this.filtro_fecha.formatted;
    this.Cargando2 = true;
    this.query =
      '?fecha_inicio=' +
      this.filtro_fecha_inicio +
      '&fecha_fin=' +
      this.filtro_fecha_fin +
      '&tipo=' +
      tipo +
      '&idtipo=' +
      '1' +
      '&producto=' +
      this.ProductoConsulta['Id_Producto'];
    this.http
      .get(this.globales.base_url + '/php/reportekardex/consulta_kardexd.php', {
        params: {
          fecha_inicio: this.filtro_fecha_inicio,
          fecha_fin: this.filtro_fecha_fin,
          tipo: tipo,
          idtipo: '1',
          producto: this.ProductoConsulta['Id_Producto'],
        },
      })
      .subscribe((data: any) => {
        this.Cargando2 = false;
        this.Lista_Productos = data.Productos;
        this.showBatchFunct();
        this.getVariablesKeys();
        // console.log(data.Productos);
        this.inicial = data.Inicial;
        this.contador = data.Inicial;
        this.Saldo_Actual = data.Saldo_Actual.Cantidad;
      });
  }

  crearExcel() {
    let acum = 0;
    let productos = this.Lista_Productos.map((prod) => {
      return {
        Fecha: prod.Fecha,
        Tipo: prod.Tipo,
        Codigo: prod.Codigo,
        Factura: prod.Codigo_Fact,
        Origen: prod.Origen,
      };
    });
    console.log(this.Lista_Productos);
    // this._excel.exportAsExcelFile(this.Lista_Productos, 'Reporte Kardex');
  }
  showBatch: boolean = false;
  showBatchFunct() {
    this.showBatch = this.Lista_Productos.some((item) => item.Lote);
  }
  variablesKeys: string[] = [];
  getVariablesKeys() {
    if (this.Lista_Productos.length > 0) {
      const firstItemWithVariables = this.Lista_Productos.find((item) => item.variables);
      if (firstItemWithVariables && firstItemWithVariables.variables) {
        this.variablesKeys = Object.keys(firstItemWithVariables.variables);
      }
    }
  }

  downloadKardex() {
    const request = (resolve: any) => {
      this.reportekardexService.downloadKardex(this.query).subscribe({
        next: (response: BlobPart) => {
          let blob = new Blob([response], { type: 'application/excel' });
          let link = document.createElement('a');
          const filename = `kardex` + this.reportekardexService.currentDateTime();
          link.href = window.URL.createObjectURL(blob);
          link.download = `${filename}.xlsx`;
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
    this.swalService.swalLoading('Vamos a descargar el reporte kardex', request);
  }

  downloadReport(ruta, id) {
    const request = (resolve: any) => {
      this.reportekardexService.downloadReporteKardex(ruta, id).subscribe({
        next: (response: BlobPart) => {
          let blob = new Blob([response], { type: 'application/pdf' });
          let link = document.createElement('a');
          const filename = 'reporte' + this.reportekardexService.currentDateTime();
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
    this.swalService.swalLoading('Vamos a descargar el reporte', request);
  }
}

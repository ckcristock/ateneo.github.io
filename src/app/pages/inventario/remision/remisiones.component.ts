import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  TemplateRef,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location, NgIf, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { MatAccordion } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { skipContentType } from 'src/app/http.context';
import { MatPaginator } from '@angular/material/paginator';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionButtonComponent } from '../../../shared/components/standard-components/action-button/action-button.component';
import { ActionViewComponent } from '../../../shared/components/standard-components/action-view/action-view.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { downloadFile } from '@shared/functions/download-pdf.function';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-remisiones',
  templateUrl: './remisiones.component.html',
  styleUrls: ['./remisiones.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    RouterLink,
    TableComponent,
    NgIf,
    NgClass,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionButtonComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    DatePipe,
    AutomaticSearchComponent,
    StatusBadgeComponent,
  ],
})
export class RemisionesComponent implements OnInit {
  datePipe = new DatePipe('es-CO');
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }
  public Mes = [];
  public Datos: any = [];
  public Remisiones = [];
  public Nofacturadas: any = [];
  public Facturadas: any = [];
  public Noconforme: any = [];
  public Borrador: any = [];
  public Anulada: any = [];
  public Indicador: boolean = true;
  public Anuladas: any = {};
  public studentChartOption: any;
  public Cargando: boolean = true;
  @ViewChild('studentChart') studentChart: ElementRef;
  deleteSwal: any = {};
  @ViewChild('inputC') inputC: ElementRef;
  public facturacionChartTag: CanvasRenderingContext2D;
  rowsFilter = [];
  tempFilter = [];
  columns = [];
  loadingIndicator = true;
  timeout: any;
  public user: any;
  Lista_Remisiones: any = [];
  loadingDownload = -1;
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  public filtro_fecha: any = '';
  public filtro_cod: string = '';
  public filtro_tipo: string = '';
  public filtro_origen: string = '';
  public filtro_grupo: string = '';
  public filtro_destino: string = '';
  public filtro_est: string = '';
  public filtro_fase: string = '';

  public punto_informe = 0;
  public punto_informe2 = 0;
  public fecha_informe = '';
  public fecha_informe2 = '';
  public Id_Remision: any = '';
  public Id_Contrato: any = '';

  public Puntos = [];
  public Clientes = [];

  date: { year: number; month: number };
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaEstado') PlantillaEstado: TemplateRef<any>;
  @ViewChild('PlantillaTipo') PlantillaTipo: TemplateRef<any>;
  @ViewChild('EstadoRemision') EstadoRemision: TemplateRef<any>;
  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });
  public studentChartData: any;
  public alertInputOption: SweetAlertOptions = {};
  public env = environment;

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private readonly swalService: SwalService,
  ) {
    this.ListarRemisiones();
  }
  selectedDate(start, end) {
    this.filtro_fecha =
      this.datePipe.transform(start, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(end, 'yyyy-MM-dd');
    this.filtros();
  }

  clearDate(event) {
    event.stopPropagation();
    this.filtro_fecha = '';
  }

  ngOnInit() {
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end);
      }
    });
    this.user = JSON.parse(localStorage.getItem('User'));
    this.http
      .get(environment.base_url + '/php/remision/grafica_remisiones.php', {
        context: skipContentType(),
      })
      .subscribe((res: any) => {
        res.data.forEach((element) => {
          this.Mes.push(element.date);
          this.Remisiones.push(element.Remisiones);
        });
      });

    this.http
      .get(environment.base_url + '/php/remision/detalle_tipo.php', {
        context: skipContentType(),
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.Datos = data.Tipo;
        this.Anuladas = data.Anuladas;
        this.Facturadas = data.Tipo_Facturacion.Facturadas;
        this.Nofacturadas = data.Tipo_Facturacion.No_Facturadas;
        this.Noconforme = data.No_Conforme;
      });
    this.ListarBorradores();

    this.alertInputOption = {
      title: 'Observacion ',
      text: 'Ingrese una Observacion o motivo de anulacion',
      input: 'text',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Anular',
      focusCancel: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (!value) {
            resolve('Valor no puede estar vacio');
          } else if (value.length < 10) {
            resolve('la observacion debe tener como minimo 10 caracteres!');
          } else {
            //Metodo de Anular
            this.AnularRemision(value);
            resolve('');
          }
        });
      },
      // type: 'info'
    };
  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros;
  }

  ListarBorradores() {
    this.http
      .get(
        environment.base_url +
          '/php/remision/borradores_remision.php?func=' +
          environment.id_funcionario,
        {
          context: skipContentType(),
        },
      )
      .subscribe((data: any) => {
        this.Borrador = data;
      });
  }

  ListarRemisiones() {
    let params = this.route.snapshot.queryParams;
    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.filtro_fecha = params.fecha ? params.fecha : '';
      this.filtro_cod = params.cod ? params.cod : '';
      this.filtro_tipo = params.tipo ? params.tipo : '';
      this.filtro_origen = params.origen ? params.origen : '';
      this.filtro_grupo = params.grupo ? params.grupo : '';
      this.filtro_destino = params.destino ? params.destino : '';
      this.filtro_est = params.est ? params.est : '';
      this.filtro_fase = params.fase ? params.fase : '';

      queryString =
        '?' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');
    }
    this.http
      .get(environment.base_url + '/php/remision_nuevo/remisiones.php' + queryString, {
        context: skipContentType(),
      })
      .subscribe((res: any) => {
        this.Cargando = false;
        this.Lista_Remisiones = res.data.data;
        this.pagination.length = res.data.total;
      });

    this.http
      .get(environment.base_url + '/php/remision/detalle_tipo.php', {
        context: skipContentType(),
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.Datos = data.Tipo;
        this.Anuladas = data.Anuladas;
        this.Facturadas = data.Tipo_Facturacion.Facturadas;
        this.Nofacturadas = data.Tipo_Facturacion.No_Facturadas;
      });
  }
  EliminarBorrador(id) {
    let datos = new FormData();
    datos.append('Id_Borrador', id);
    this.http
      .post(environment.base_url + '/php/remision/elimina_borrador.php', datos)
      .subscribe((data: any) => {
        this.swalService.show({
          title: 'Borrador Eliminado',
          text: 'Su Borrador Fue Eliminado de Manera Correcta, Los productos seleccionados, liberaron sus cantidades',
          icon: 'success',
        });
        this.ListarBorradores();
      });
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.filtro_fecha = event;
    } else {
      this.filtro_fecha = '';
    }
    this.filtros();
  }
  dateRangeChanged2(event, tipo) {
    if (event.formatted != '') {
      if (tipo == 'remision') {
        this.fecha_informe = event.formatted;
      } else {
        this.fecha_informe2 = event.formatted;
      }
    } else {
      if (tipo == 'remision') {
        this.fecha_informe = '';
      } else {
        this.fecha_informe2 = '';
      }
    }
  }

  filtros() {
    let params: any = {};
    params.page = this.pagination.page;
    params.pageSize = this.pagination.pageSize;
    if (
      this.filtro_fecha != '' ||
      this.filtro_cod != '' ||
      this.filtro_tipo != '' ||
      this.filtro_origen != '' ||
      this.filtro_grupo != '' ||
      this.filtro_destino != '' ||
      this.filtro_est ||
      this.filtro_fase
    ) {
      if (this.filtro_fecha != '' && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha;
      }
      if (this.filtro_cod != '') {
        params.cod = this.filtro_cod;
      }
      if (this.filtro_tipo != '') {
        params.tipo = this.filtro_tipo;
      }
      if (this.filtro_origen != '') {
        params.origen = this.filtro_origen;
      }
      if (this.filtro_grupo != '') {
        params.grupo = this.filtro_grupo;
      }
      if (this.filtro_destino != '') {
        params.destino = this.filtro_destino;
      }
      if (this.filtro_est != '') {
        params.est = this.filtro_est;
      }
      if (this.filtro_fase != '') {
        params.fase = this.filtro_fase;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/inventario/remisiones', queryString);

      this.Cargando = true;

      this.http
        .get(environment.base_url + '/php/remision_nuevo/remisiones.php?' + queryString, {
          context: skipContentType(),
        })
        .subscribe((res: any) => {
          this.Cargando = false;
          this.Lista_Remisiones = res.data.data;
          this.pagination.length = res.data.total;
        });
    } else {
      this.location.replaceState('/inventario/remisiones', '');

      this.filtro_cod = '';
      this.filtro_destino = '';
      this.filtro_est = '';
      this.filtro_fecha = '';
      this.filtro_tipo = '';
      this.filtro_origen = '';
      this.filtro_grupo = '';
      this.filtro_fase = '';

      this.Cargando = true;
      this.http
        .get(environment.base_url + '/php/remision_nuevo/remisiones.php', {
          params,
          context: skipContentType(),
        })
        .subscribe((res: any) => {
          this.Cargando = false;
          this.Lista_Remisiones = res.data.data;
          this.pagination.length = res.data.total;
        });
    }
  }

  SuspenderRemision(id, idc) {
    this.Id_Remision = id;
    this.Id_Contrato = idc;
    this.swalService.customAlert(this.alertInputOption);
  }

  AnularRemision(value) {
    let datos = new FormData();
    datos.append('modulo', 'Remision');
    datos.append('id', this.Id_Remision);
    datos.append('idc', this.Id_Contrato);
    datos.append('funcionario', this.user.Identificacion_Funcionario);
    datos.append('observacion', functionsUtils.utf8_encode(value));
    this.http
      .post(environment.base_url + '/php/remision_nuevo/anular_remision_dev.php', datos)
      .subscribe((data: any) => {
        this.deleteSwal.title = data.title;
        this.deleteSwal.icon = data.type;
        this.deleteSwal.text = data.message;
        this.swalService.show(this.deleteSwal);
        this.ListarRemisiones();

        this.Id_Remision = '';
      });
  }

  onFileDownload(req: string, name: string, index: number, type?: string) {
    this.loadingDownload = index;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .get(`${environment.base_url}/${req}`, {
        responseType: 'blob' as 'json',
        headers,
      })
      .subscribe({
        next: (file: any) => {
          downloadFile({ name: name, file, type });
          this.loadingDownload = -1;
        },
        error: () => {
          this.loadingDownload = -1;
        },
      });
  }
}

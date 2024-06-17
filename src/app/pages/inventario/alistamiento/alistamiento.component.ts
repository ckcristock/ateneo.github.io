import { NgIf } from '@angular/common';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalBasicComponent } from '../../../components/modal-basic/modal-basic.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ActionEditComponent } from '../../../shared/components/standard-components/action-edit/action-edit.component.js';
import { ActionButtonComponent } from '../../../shared/components/standard-components/action-button/action-button.component.js';
import { ActionViewComponent } from '../../../shared/components/standard-components/action-view/action-view.component.js';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component.js';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadImageComponent } from '../../../shared/components/load-image/load-image.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component.js';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { downloadFile } from '@shared/functions/download-pdf.function';
import { setFilters } from '@shared/functions/url-filter.function';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-alistamiento',
  templateUrl: './alistamiento.component.html',
  styleUrls: ['./alistamiento.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    TableComponent,
    LoadImageComponent,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionButtonComponent,
    ActionEditComponent,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    ModalBasicComponent,
    DatePipe,
    StatusBadgeComponent,
    ModalComponent,
    AutomaticSearchComponent,
    DatePickerComponent,
  ],
})
export class AlistamientoComponent implements OnInit {
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaTipo') PlantillaTipo: TemplateRef<any>;
  confirmacionSwal: any = {};
  @ViewChild('modalGuiaRemision') modalGuiaRemision: any;
  @ViewChild('editEnlistment') editEnlistment: any;
  @ViewChild('FormGuiaRemision') FormGuiaRemision: NgForm;
  public alertOption: SweetAlertOptions = {};
  FaseI: any[] = [];
  FaseII: any[] = [];
  public user: any;
  public Id_Remision: any;
  Alistamientos: any = [];

  pagination_phase1 = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  pagination_phase2 = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  pagination_enlistment = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  public Editar = {
    Id_Remision: '',
    Numero_Guia: '',
    Empresa_Envio: '',
    Tipo: 'Creacion',
    Tipo_Rem: 'Creacion',
    Identificacion_Funcionario: '1',
  };
  public filtro_cod: string = '';
  public filtro_tipo: string = '';
  public filtro_origen: string = '';
  public filtro_destino: string = '';
  public filtro_est: string = '';
  public filtro_fecha: any = '';
  public filtro_fases: any = '';

  public filtro_Origen1: string = '';
  public filtro_Destino1: string = '';
  public filtro_Codigo1: string = '';

  public filtro_Origen2: string = '';
  public filtro_Destino2: string = '';
  public filtro_Codigo2: string = '';
  public ElementosFaseI: any;
  public ElementosFaseII: any;
  public Alistadas: any;
  date: { year: number; month: number };

  public ValidaFase1: boolean;
  public ValidaFase2: boolean;
  alive: any;
  envi: any = '';

  downloading = -1;

  redirectPhase1 = -1;
  redirectPhase2 = -1;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private readonly swalService: SwalService,
    private readonly modalService: NgbModal,
  ) {
    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a guardar los datos de envio de la Remision',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarGuiaRemision();
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    };
  }
  loading = true;
  ngOnInit() {
    this.envi = environment.base_url;
    /* TODO auth user */
    this.user = {
      Identificacion_Funcionario: '1',
    };
    this.filtros();
    this.filtrosFase1();
    this.filtrosFase2();

    this.ElementosFaseI = setInterval(() => {
      this.filtrosFase1();
    }, 6000000);

    this.ElementosFaseII = setInterval(() => {
      this.filtrosFase2();
    }, 1000000);
    this.Alistadas = setInterval(() => {
      this.filtros();
    }, 1000000);
  }
  ngOnDestroy() {
    clearInterval(this.ElementosFaseI);
    clearInterval(this.ElementosFaseII);
    clearInterval(this.Alistadas);
  }

  selectedDate(dates: DatePicker) {
    if (dates.start_date) this.filtro_fecha = `${dates.start_date} - ${dates.end_date}`;
    else this.filtro_fecha = '';
    this.filtros();
  }

  save() {
    const request = () => {
      this.GuardarGuiaRemision();
    };
    this.swalService.swalLoading('Se dispone a guardar los datos de envio de la remisión', request);
  }

  filtros() {
    this.loading = true;
    let params: any = { ...this.pagination_enlistment };
    delete params.length;
    params.fecha = this.filtro_fecha;
    params.cod = this.filtro_cod;
    params.tipo = this.filtro_tipo;
    params.origen = this.filtro_origen;
    params.destino = this.filtro_destino;
    if (this.filtro_fases != '' && this.filtro_fases == 1) {
      params.fases = 1;
      this.filtro_est = 'Pendiente';
    } else if (this.filtro_fases != '' && this.filtro_fases == 2) {
      params.fases = 2;
      this.filtro_est = '';
    }
    params.est = this.filtro_est;
    params = setFilters(params);
    this.http
      .get(environment.base_url + '/php/alistamiento/detalle_alistamiento.php' + params)
      .subscribe((res: any) => {
        const { data } = res;
        this.Alistamientos = data.data;
        this.pagination_enlistment.length = data.total;
        this.loading = false;
      });
  }

  filtrosFase1() {
    this.ValidaFase1 = true;
    let params: any = {
      ...this.pagination_phase1,
    };
    delete params.length;
    params.codigo1 = this.filtro_Codigo1;
    params.origen1 = this.filtro_Origen1;
    params.destino1 = this.filtro_Destino1;
    params = setFilters(params);
    this.http
      .get(
        environment.base_url +
          '/php/alistamiento_nuevo/detalle_fase1.php' +
          params +
          '&funcionario=' +
          this.user.Identificacion_Funcionario,
      )
      .subscribe((res: any) => {
        const { data } = res;
        this.FaseI = data.data;
        this.pagination_phase1.length = data.total;
        this.ValidaFase1 = false;
      });
  }

  filtrosFase2() {
    let params: any = {
      ...this.pagination_phase2,
    };
    delete params.length;
    params.codigo2 = this.filtro_Codigo2;
    params.origen2 = this.filtro_Origen2;
    params.destno2 = this.filtro_Destino2;
    this.ValidaFase2 = true;
    params = setFilters(params);
    this.http
      .get(
        environment.base_url +
          '/php/alistamiento_nuevo/detalle_fase2.php' +
          params +
          `&funcionario=${this.user.Identificacion_Funcionario}`,
      )
      .subscribe((data: any) => {
        this.FaseII = data.data.data;
        this.pagination_phase2.length = data.data.total;
        this.ValidaFase2 = false;
      });
  }

  Bandera_Fase1(id, tipo, idc, index: number) {
    this.redirectPhase1 = index;
    let mod = tipo == 'Devolucion' ? 'Devolucion_Compra' : 'Remision';
    this.http
      .get(environment.base_url + '/php/alistamiento/guardar_hora_inicio.php', {
        params: {
          id: id,
          mod,
          funcionario: this.user.Identificacion_Funcionario,
          tipo: 'Fase1',
          idc: idc,
        },
      })
      .subscribe((data: any) => {
        this.router.navigate(['/inventario/alistamiento/crear', id, tipo, +idc]);
      });
  }
  Bandera_Fase2(id, tipo, idc, index: number) {
    this.redirectPhase2 = index;
    let mod = tipo == 'Devolucion' ? 'Devolucion_Compra' : 'Remision';
    this.http
      .get(environment.base_url + '/php/alistamiento/guardar_hora_inicio.php', {
        params: {
          id,
          mod,
          funcionario: this.user.Identificacion_Funcionario,
          tipo: 'Fase2',
          idc: idc,
        },
      })
      .subscribe((data: any) => {
        this.router.navigate(['/inventario/alistamiento/crear', id, tipo, +idc]);
      });
  }
  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇçÂ®Ã\n',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnccARA ',
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++) mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
        else ret.push(c);
      }
      return ret.join('');
    };
  })();

  GuardarGuiaRemision() {
    let info = this.normalize(JSON.stringify(this.Editar));
    let datos = new FormData();
    datos.append('datos', info);
    const headers = new HttpHeaders({
      Accept: 'text/plain',
    });

    this.http
      .post(environment.base_url + '/php/alistamiento/guardar_guia_remisiond.php', datos, {
        headers,
      })
      .subscribe((data: any) => {
        this.modalService.dismissAll();
        this.confirmacionSwal.title = 'Operación exitosa';
        this.confirmacionSwal.text =
          'Se han Guardado los datos de la guia de la remisión exitosamente';
        this.confirmacionSwal.icon = 'success';
        this.swalService.show({ ...this.confirmacionSwal, showCancel: false });
        this.Editar = {
          Id_Remision: '',
          Numero_Guia: '',
          Empresa_Envio: '',
          Tipo: 'Creacion',
          Tipo_Rem: '',
          Identificacion_Funcionario: JSON.parse(localStorage.getItem('User'))
            .Identificacion_Funcionario,
        };
        this.filtros();
      });
  }
  CapturarId(id, tipo) {
    this.Editar.Id_Remision = id;
    this.Editar.Tipo_Rem = tipo;
    this.modalService.open(this.editEnlistment, { size: 'lg' });
    this.Editar.Empresa_Envio = '';
    this.Editar.Numero_Guia = '';
  }
  EditarGuia(id, pos, tipo) {
    this.Editar.Id_Remision = id;
    this.Editar.Empresa_Envio = this.Alistamientos[pos].Empresa_Envio;
    this.Editar.Numero_Guia = this.Alistamientos[pos].Guia;
    this.Editar.Tipo = 'Edicion';
    this.Editar.Tipo_Rem = tipo;
    this.modalService.open(this.editEnlistment, { size: 'lg' });
  }

  onFileDownload(req: string, id: number, index: number, name: string) {
    const params: any = {
      id,
    };
    if (!req.includes('zebra')) params.tipo = 'Remision';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.downloading = index;
    this.http
      .get(`${environment.base_url}${req}`, {
        responseType: 'blob' as 'json',
        headers,
        params,
      })
      .subscribe({
        next: (file: any) => {
          downloadFile({ name: name, file });
          this.downloading = -1;
        },
        error: () => {
          this.downloading = -1;
        },
      });
  }
}

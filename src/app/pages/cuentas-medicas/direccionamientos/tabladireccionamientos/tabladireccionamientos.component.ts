import { Component, OnInit, Input, ViewChild } from '@angular/core';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from 'src/app/services/general.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { DireccionamientoService } from '../direccionamiento.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-tabladireccionamientos',
  templateUrl: './tabladireccionamientos.component.html',
  styleUrls: ['./tabladireccionamientos.component.scss'],
  standalone: true,
  imports: [
    NotDataComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    RouterLink,
    MatPaginatorModule,
    DatePipe,
  ],
})
export class TabladireccionamientosComponent implements OnInit {
  @ViewChild('anularSwal') anularSwal: any;
  public alertOption: SweetAlertOptions = {};

  public Cargando: boolean = false;
  @Input() Filtros: any = {
    paciente: '',
    fecha: '',
    NoPrescripcion: '',
    Dispensacion: '',
  };
  public perfilUsuario: any = localStorage.getItem('miPerfil');
  public Direccionamientos: Array<any> = [];
  @Input() Tipo;
  @Input() Identificacion;
  //Paginación
  public maxSize = 5;
  public pageSize = 20;
  public TotalItems: number;
  public page = 1;
  public Id_Direccionamiento: any = '';
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };
  @ViewChild('deleteSwal') deleteSwal: any;

  public myDateRangePickerOptions: any = {
    width: '90px',
    height: '18px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  globales = environment;

  constructor(
    public generalService: GeneralService,
    private http: HttpClient,
    private _swalService: SwalService,
    private _direccionamientos: DireccionamientoService,
  ) {}

  ngOnInit() {
    // buscamos el grupo del usuario para permitir o denegar acciones de administrador.
    //let Funcionario = JSON.parse(this.perfilUsuario);
    //this.Identificacion = Funcionario.Identificacion_Funcionario;

    this.ConsultaFiltrada();

    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a eliminar este Direccionamiento en Sigespro',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Eliminar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.EliminarDireccionamientoFinal();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  onPagination(pageObj: MatPaginator): void {
    this.page = (pageObj?.pageIndex ?? 0) + 1;
    this.ConsultaFiltrada(true);
  }

  perfilAdministrador() {
    let miPerfil = localStorage.getItem('miPerfil');
    if (miPerfil == '16') {
      return true;
    }

    return false;
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pageSize;
    params.est = this.Tipo;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.paciente != '') {
      params.pac = this.Filtros.paciente;
    }

    if (this.Filtros.fecha != '') {
      params.fecha = this.Filtros.fecha;
    }
    if (this.Filtros.NoPrescripcion != '') {
      params.presc = this.Filtros.NoPrescripcion;
    }
    if (this.Filtros.Dispensacion != '') {
      params.dis = this.Filtros.Dispensacion;
    }

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    var params = this.SetFiltros(paginacion);

    if (params === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;

    this._direccionamientos.getDireccionamientos(params).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Direccionamientos = JSON.parse(
          this.generalService.Utf8.decode(JSON.stringify(data.query_result)),
        );
        this.TotalItems = data.numReg;
      } else {
        this.Direccionamientos = [];
      }

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues() {
    this.Filtros = {
      paciente: '',
      fecha: '',
    };
  }
  SetInformacionPaginacion() {
    var calculoHasta = this.page * this.pageSize;
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  EliminarDireccionamiento(id) {
    this.Id_Direccionamiento = id;
    Swal.fire(this.alertOption);
  }

  EliminarDireccionamientoFinal() {
    let datos = new FormData();
    datos.append('modulo', 'Dispensacion_Mipres');
    datos.append('id', this.Id_Direccionamiento);
    this.http
      .post(this.globales.ruta + 'php/mipres/eliminar_direccionamiento.php', datos)
      .subscribe((data: any) => {
        this._swalService.show({
          title: 'Direccionamiento Eliminado',
          text: 'Se ha Eliminado correctamente el Direccionamiento y se ha anulado su programación',
          icon: 'success',
          showCancel: false,
        });
        this.ConsultaFiltrada();
        this.Id_Direccionamiento = '';
      });
  }
  public OnDateRangeChanged(event: any) {
    if (event.formatted != '') {
      this.Filtros.fecha = event.formatted;
    } else {
      this.Filtros.fecha = '';
    }
    this.ConsultaFiltrada();
  }
}

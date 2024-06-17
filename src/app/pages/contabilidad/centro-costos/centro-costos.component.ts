import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectOption, NgForm, FormsModule } from '@angular/forms';
import { CentroCostosService } from './centro-costos.service';
import { Globales } from '../globales';
import { HttpClient } from '@angular/common/http';
import { Location, NgIf, NgFor, NgClass, LowerCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/core/services/user.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-centro-costos',
  templateUrl: './centro-costos.component.html',
  styleUrls: ['./centro-costos.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    MatSelectModule,
    MatOptionModule,
    NotDataComponent,
    LowerCasePipe,
  ],
})
export class CentroCostosComponent implements OnInit {
  @ViewChild('modalCentroCosto') modalCentroCosto: any;
  @ViewChild('modalVerCentroCosto') modalVerCentroCosto: any;
  @ViewChild('alertSwal') alertSwal: any;
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
  openInNewTab() {
    window
      .open(
        this.enviromen.base_url + '/php/centroscostos/exportar.php?company=' + this.company_id,
        '_blank',
      )
      .focus();
  }
  enviromen: any;
  public Cargando: boolean;
  public Costos: any = [];
  public maxSize = 15;
  public pageSize = 20;
  public TotalItems: 0;
  public page: number;
  public filtro_nombre = '';
  public filtro_codigo = '';
  public filtro_cuenta = '';
  public CentrosCostosPadre: Array<NgSelectOption>;
  public company_id: any;

  public items: any = [];
  public ValorTipo: any = 'tipo';

  public CentroCostoModel: any = {
    Nombre: '',
    Codigo: '',
    //EsCentroPadre: false,
    Id_Centro_Padre: '',
    Id_Tipo_Centro: '',
    Valor_Tipo_Centro: '',
    company_id: '',
    //Nivel: 0
  };

  public EditarCentroCostoModel: any = {
    Nombre: '',
    Codigo: '',
    Id_Centro_Padre: '',
    Id_Tipo_Centro: '',
    Valor_Tipo_Centro: '',
    Id_Centro_Costo: '',
    company_id: '',
  };

  public VerCentroCostoModel: any = {
    NombreCentro: '',
    CodigoCentro: '',
    PadreCentro: '',
    TipoCentro: '',
    ValorTipoCentro: '',
    Empresa: '',
  };

  public TiposCentro1: Array<string> = ['Tercero', 'Departamento'];

  public TiposCentro: any = [];

  public Niveles: Array<number> = [1, 2, 3, 4, 5];

  public Filtros: any = {
    Codigo: '',
    Nombre: '',
    Id_Empresa: '',
  };

  public CentrosPadre: Array<string> = ['Administracion', 'Contabilidad'];

  public ValoresTipoCentro: any = [];
  public CentrosCostos: any = [];
  public CentrosCostosEditar: any = [];

  public CodigoPlaceholder: string = 'Codigo';
  constructor(
    public globales: Globales,
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private _centroCosto: CentroCostosService,
    private _user: UserService,
    private _modal: ModalService,
    private _swal: SwalService,
  ) {
    // private _workOrders: OrdenesProduccionService
  }

  ngOnInit() {
    this.enviromen = environment;
    this.company_id = this._user.user.person.company_worked.id;

    this.filtrar();
    this.QueryTipoCentros();
    // this.QueryCentrosCostos();
  }

  openModal(content) {
    this.ValorTipo = 'tipo';
    this._modal.openLg(content);
  }

  ListarCostos() {
    /* this.http.get(environment.base_url + '/php/centroscostos/centro_costos_listar.php').subscribe((data: any) => {
      this.items = data;
    }); */

    let queryString = this.getQueryParams();
    /*
        this.http.get(environment.base_url + '/php/centroscostos/lista_centros_costos.php'+queryString, {params: { company_id: this._user.user.person.company_worked.id }}).subscribe((data: any) => {
          this.items = data.Centros;
          this.TotalItems = data.numReg;
        });*/
  }

  getQueryParams() {
    let queryParams = this.route.snapshot.queryParams;

    this.Filtros.Codigo = queryParams.cod ? queryParams.cod : '';
    this.Filtros.Nombre = queryParams.nom ? queryParams.nom : '';
    this.page = queryParams.pag ? queryParams.pag : 1;

    let queryString =
      '?' +
      Object.keys(queryParams)
        .map((key) => key + '=' + queryParams[key])
        .join('&');

    return queryString;
  }

  getQueryStringFiltro() {
    let params: any = {
      pag: this.page,
    };

    if (this.company_id != '') {
      params.company_id = this.company_id;
    }
    if (this.Filtros.Codigo != '') {
      params.cod = this.Filtros.Codigo;
    }

    if (this.Filtros.Nombre != '') {
      params.nom = this.Filtros.Nombre;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/contabilidad/centro-costos', queryString); // actualizando URL

    return queryString;
  }

  filtrar(paginacion?) {
    this.Cargando = true;
    if (typeof paginacion === 'undefined' || paginacion == 'No') {
      this.page = 1;
    }

    let queryString = this.getQueryStringFiltro();

    this.http
      .get(environment.base_url + '/php/centroscostos/lista_centros_costos.php?' + queryString)
      .subscribe((data: any) => {
        this.items = data.Centros;
        this.Cargando = false;
        this.TotalItems = data.numReg;
        this.CentrosCostosPadre = data.CentrosCostosPadre;
      });
  }

  QueryCentrosCostos(idCentro: string = '') {
    if (idCentro === '') {
      this.http
        .get(environment.base_url + '/php/centroscostos/lista_centros_costos.php', {
          params: { company_id: this._user.user.person.company_worked.id },
        })
        .subscribe((data: any) => {
          this.CentrosCostos = data.Centros;
          this.CentrosCostosPadre = data.CentrosCostosPadre;
        });
    } else {
      this.http
        .get(environment.base_url + '/php/centroscostos/lista_centros_costos.php', {
          params: { id_centro: idCentro, company_id: this._user.user.person.company_worked.id },
        })
        .subscribe((data: any) => {
          this.CentrosCostosEditar = data.Centros;
          this.CentrosCostosPadre = data.CentrosCostosPadre;
        });
    }
  }

  QueryTipoCentros() {
    this.http
      .get(environment.base_url + '/php/centroscostos/lista_tipo_centro.php')
      .subscribe((data: any) => {
        this.TiposCentro = data;
      });
  }

  GuardarCentroCosto(FormCentroCosto: NgForm, modalCentroCosto: any, funcion: string) {
    this._swal
      .show({
        title: '¿Está seguro(a)?',
        text: 'Vamos a guardar el centro de costo',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          if (funcion == 'guardar') {
            let datos = new FormData();
            this.CentroCostoModel.company_id = this.company_id;
            let data = this.normalize(JSON.stringify(this.CentroCostoModel));
            datos.append('Datos', data);
            datos.append('accion', funcion);
            this.PeticionGuardarCentro(datos);
            this._modal.close();
            this.LimpiarModelo();
          } else if (funcion == 'editar') {
            let datos = new FormData();
            this.EditarCentroCostoModel.company_id = this.company_id;
            let data = this.normalize(JSON.stringify(this.EditarCentroCostoModel));
            datos.append('Datos', data);
            datos.append('accion', funcion);
            this.PeticionGuardarCentro(datos);
            this._modal.close();
            this.LimpiarModelo();
          }
        }
      });
  }

  AbrirModalNuevoCentro() {
    this.modalCentroCosto.show();
  }

  AbrirModalVerCentro() {
    this.modalVerCentroCosto.show();
  }

  ValorTipoCentro(value) {
    switch (value) {
      case 1:
        this.CentroCostoModel.ValorTipo = 'Tercero';
        this.ValorTipo = 'Tercero';

        this.http
          .get(environment.base_url + '/php/centroscostos/listar_valores_tipo_centro.php', {
            params: { id_tipo: value, tipo: 'Tercero', company: this.company_id },
          })
          .subscribe((data: any) => {
            this.ValoresTipoCentro = data;
          });
        break;

      case 2:
        this.CentroCostoModel.ValorTipo = 'Departamento';
        this.ValorTipo = 'Departamento';

        this.http
          .get(environment.base_url + '/php/centroscostos/listar_valores_tipo_centro.php', {
            params: { id_tipo: value, tipo: 'Departamento', company: this.company_id },
          })
          .subscribe((data: any) => {
            this.ValoresTipoCentro = data;
          });
        break;

      case 3:
        this.CentroCostoModel.ValorTipo = 'Órdenes de producción';
        this.ValorTipo = 'Órdenes de producción';
        // this._workOrders.getWorkOrdersIndex().subscribe((res: any) => {
        //   this.ValoresTipoCentro = res.data;

        // })

        /*  this.http.get(environment.base_url + '/php/centroscostos/listar_valores_tipo_centro.php', { params: { id_tipo: value, tipo: 'Zonas', company: this.company_id } }).subscribe((data: any) => {

         }); */
        break;
      case 4:
        this.CentroCostoModel.ValorTipo = 'Municipio';
        this.ValorTipo = 'Municipio';

        this.http
          .get(environment.base_url + '/php/centroscostos/listar_valores_tipo_centro.php', {
            params: { id_tipo: value, tipo: 'Municipio', company: this.company_id },
          })
          .subscribe((data: any) => {
            this.ValoresTipoCentro = data;
          });
        break;

      default:
        this.CentroCostoModel.ValorTipo = 'Tipo';
        this.ValorTipo = 'Tipo';
        this.ValoresTipoCentro = [];
        break;
    }
  }

  checkValue(event: any) {
    if (event) {
      this.CodigoPlaceholder = 'Ej: 001';
      this.CentroCostoModel.Nivel = '';
      this.CentroCostoModel.Padre = '';
    } else {
      this.CodigoPlaceholder = 'Ej: 01';
    }
  }

  Validaciones() {
    if (this.CentroCostoModel.EsCentroPadre) {
      if (this.CentroCostoModel.Codigo.length < 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Alerta',
          text: 'El código de un centro de costo padre no puede ser de dos(2) dígitos',
        });
      }
    }
  }

  VerCentroCosto(idCentroCosto) {
    this.http
      .get(environment.base_url + '/php/centroscostos/consultar_centro_costo.php', {
        params: { id_centro: idCentroCosto.toString() },
      })
      .subscribe((data: any) => {
        this.VerCentroCostoModel = {
          NombreCentro: '',
          CodigoCentro: '',
          PadreCentro: '',
          TipoCentro: '',
          ValorTipoCentro: '',
        };
      });
  }

  EditarCentroCosto(idCentroCosto, content) {
    this.http
      .get(environment.base_url + '/php/centroscostos/consultar_centro_costo.php', {
        params: { id_centro: idCentroCosto.toString(), opcion: 'editar' },
      })
      .subscribe((data: any) => {
        this.ValorTipoCentro(data.Id_Tipo_Centro);
        this.QueryCentrosCostos(idCentroCosto);

        setTimeout(() => {
          this.EditarCentroCostoModel = data;
        }, 300);

        this.openModal(content);
      });
  }

  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
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

  PeticionGuardarCentro(data) {
    this.http
      .post(environment.base_url + '/php/centroscostos/guardar_centros_costos.php', data)
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this._swal.show({
            icon: 'success',
            title: 'Registro exitoso',
            text: '',
            showCancel: false,
            timer: 1000,
          });
          this.ListarCostos();
          //this.filtrar();
        } else {
          this._swal.show({
            icon: 'error',
            title: 'Error!',
            text: data.mensaje,
            showCancel: false,
          });
        }
      });
  }

  LimpiarModelo() {
    this.CentroCostoModel = {
      Nombre: '',
      Codigo: '',
      Id_Centro_Padre: '0',
      Id_Tipo_Centro: '',
      Valor_Tipo_Centro: '',
      ValorTipo: 'Escoja el tipo',
    };
  }

  CambiarEstado(id_centro) {
    this._swal
      .show({
        icon: 'question',
        title: 'Cambio de estado',
        text: 'Vamos a cambiar el estado del centro de costo.',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this.http
            .get(environment.base_url + '/php/centroscostos/cambiar_estado_centro_costo.php', {
              params: { id_centro: id_centro.toString() },
            })
            .subscribe((data: any) => {
              if (data.codigo == 0) {
                this._swal.show({
                  icon: 'success',
                  title: 'Cambio exitoso',
                  text: data.mensaje,
                  showCancel: false,
                  timer: 1000,
                });
              } else if (data.codigo == 1) {
                this._swal.show({
                  icon: 'warning',
                  title: 'Alerta',
                  text: data.mensaje,
                  showCancel: false,
                });
              }
              this.ListarCostos();
            });
        }
      });
  }
}

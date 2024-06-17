import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Location, NgClass, DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { PerfilService } from './perfil.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AutomaticSearchComponent } from '../../../shared/components/automatic-search/automatic-search.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionButtonComponent } from '../../../shared/components/standard-components/action-button/action-button.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-inventariopuntos',
  templateUrl: './inventariopuntos.component.html',
  styleUrls: ['./inventariopuntos.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    TableComponent,
    NgClass,
    DropdownActionsComponent,
    ActionButtonComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    AutomaticSearchComponent,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    ModalComponent,
    RouterLink,
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
  ],
})
export class InventariopuntosComponent implements OnInit, OnDestroy {
  @ViewChild('PlantillaProductos') PlantillaProductos: TemplateRef<any>;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('modalInventario') modalInventario: any;
  @ViewChild('modalApartadas') modalApartadas: any;
  @ViewChild('modalSeleccionadas') modalSeleccionadas: any;
  @ViewChild('modalCompras') modalCompras: any;

  Bodegadefecto;
  IdPuntoDispensacion;
  rowsFilter = [];
  tempFilter = [];
  columns = [];
  loadingIndicator = true;
  timeout: any;

  public puntosArray: Array<any>;

  public cargando = false;
  public bodegas: any[] = [];
  public categorias_nuevas: any[] = [];
  public display_bodega = 'block';
  public display_punto = 'none';

  public Cargando_Compras = false;
  public Compras: any = [];

  public bodegas_nuevo: any = [];
  public bodega_selected: any = 0;

  public user = JSON.parse(localStorage.getItem('User'));
  public permiso: boolean = false;

  public Inventarios: any = [];

  myDateRangePickerOptions: any = {
    width: '220px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  public filtro_nom: string = '';
  public filtro_lab: string = '';
  public filtro_lote: string = '';
  public filtro_cant: string = '';
  public filtro_cant_sel: string = '';
  public filtro_cum: string = '';
  public filtro_fecha: any = '';
  public filtro_cant_apar: any = '';
  public filtro_bod: any = '';
  public filtro_lab_gen: any = '';
  public filtro_invima: any = '';
  public filtro_grupo: any = '';
  public filtro_iva: any = '';
  public Cargando_Tabla = false;
  public Cargando_Apartadas = false;

  public listas = [];
  public lista_informe = 1;

  public tipo_punto: string = 'Bodega';
  public subtipo_punto: any = 0;
  public filtrando: boolean = false;

  public nombre_producto: string = '';
  public lote_producto: string = '';
  public fecha_venc_producto: string = '';
  public Apartadas: any = [];

  public filtro_sin_inventario: boolean = true;

  parametrosConsulta: any = {};
  csv: any;
  Cargando_Seleccionados: boolean = false;
  Seleccionados: any = [];
  private id_funcionario;
  public permisos: any = {};

  globales = environment;

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  isSelected = false;

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private perfil: PerfilService,
    public dropConfig: NgbDropdownConfig,
    private readonly userService: UserService,
    private readonly modalService: NgbModal,
  ) {
    this.id_funcionario = userService.user.person.identifier;
    // configuraciones de boton desplegable ngboostrap
    dropConfig.placement = 'left-top';
    /* dropConfig.autoClose = false; */
  }

  ngOnInit() {
    this.perfil
      .getPermisosModulo('Inventario por Puntos', this.id_funcionario)
      .subscribe((permiso) => {
        this.permisos = permiso;
      });

    this.http
      .get(this.globales.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Lista_Ganancia' },
      })
      .subscribe((data: any) => {
        this.listas = data;
      });

    this.ListarInventario(true);

    this.http
      .get(this.globales.base_url + '/php/actarecepcion/detalle_perfil_dev.php', {
        params: { funcionario: this.id_funcionario },
      })
      .subscribe((data: any) => {
        this.permiso = data.status;
      });

    this.http
      .get(this.globales.base_url + '/php/bodega_nuevo/get_bodegas.php')
      .subscribe((data: any) => {
        if (data.Tipo == 'success') this.bodegas_nuevo = data.Bodegas;
      });
  }
  ngOnDestroy(): void {
    this.paginasGuardadas.forEach((pagina) => {
      localStorage.removeItem(pagina);
    });
  }

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.filtro_fecha = `${formatDate(this.formRange.value.start as string)} - ${formatDate(
      this.formRange.value.end as string,
    )}`;
    this.filtro();
  }

  ListarInventario(primeraVez = false) {
    let params = Object.assign({}, this.route.snapshot.queryParams);
    this.pagination.page = params.pag;
    this.parametrosConsulta = params;
    if (!params.lista) {
      params.lista = 1;
    }
    if (params.id_bodega_nuevo) {
      //params.id es el id de la categoria!!!
      if (params.id) {
        this.buscar_categorias(params.id_bodega_nuevo, params.id);
      } else {
        this.buscar_categorias(params.id_bodega_nuevo);
      }
    }

    let queryString = '';

    if (Object.keys(params).length > 0 || primeraVez) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.tipo_punto = params.tipo ? params.tipo : '';
      this.subtipo_punto = params.id ? params.id : 0;
      this.Tipo(this.tipo_punto, this.subtipo_punto);
      this.customTipo(this.tipo_punto, this.subtipo_punto);
      this.filtro_nom = params.nom ? params.nom : '';
      this.filtro_lote = params.lote ? params.lote : '';
      this.filtro_lab = params.lab ? params.lab : '';
      this.filtro_cant = params.cant ? params.cant : '';
      this.filtro_cant_sel = params.cant_sel ? params.cant_sel : '';
      this.filtro_fecha = params.fecha ? params.fecha : '';
      this.filtro_cant_apar = params.cant_apar ? params.cant_apar : '';
      this.filtro_bod = params.bod ? params.bod : '';
      this.filtro_lab_gen = params.lab_gen ? params.lab_gen : '';
      this.lista_informe = params.lista ? params.lista : '';
      this.filtro_invima = params.invima ? params.invima : '';
      this.filtro_grupo = params.grupo ? params.grupo : '';
      this.filtro_sin_inventario = params.sin_inventario ? params.sin_inventario : true;
      this.bodega_selected = params.id_bodega_nuevo ? params.id_bodega_nuevo : 0;
      $('#sin-inventario').prop('checked', this.filtro_sin_inventario);

      queryString =
        '?' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');
    }
    this.Cargando_Tabla = true;

    this.http
      .get(this.globales.ruta + 'php/inventario_nuevo/filter_inventario.php' + queryString)
      .subscribe((data: any) => {
        this.Cargando_Tabla = false;
        this.Inventarios = data.inventarios;
        this.pagination.length = data.numReg;
        this.dividirEstibas();
      });
  }

  buscar_productos() {
    let params: any = {
      pag: 1,
      tipo: this.tipo_punto,
      id: this.subtipo_punto ? this.subtipo_punto : '0',
      lista: this.lista_informe,
      id_bodega_nuevo: this.bodega_selected,
      sin_inventario: this.filtro_sin_inventario,
    };

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/inventario/inventario-puntos', queryString);

    this.Cargando_Tabla = true;
    this.filtrando = true;
    this.http
      .get(this.globales.ruta + 'php/inventario_nuevo/filter_inventario.php?' + queryString)
      .subscribe((data: any) => {
        this.Cargando_Tabla = false;
        this.Inventarios = data.inventarios;
        this.pagination.length = data.numReg;
        this.dividirEstibas();
      });
    this.filtrando = false;
  }
  buscar_categorias(id_bodega_nuevo, id_categoria?) {
    this.http
      .get(this.globales.ruta + 'php/categoria_nueva/get_categorias_por_bodega.php', {
        params: { id_bodega_nuevo },
      })
      .subscribe((data: any) => {
        this.categorias_nuevas = data['Categorias'];
      });
  }

  paginacion() {
    let params: any = {
      pag: this.pagination.page,
    };

    params.sin_inventario = this.filtro_sin_inventario;

    params = Object.assign(this.parametrosConsulta, params);

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/inventario/inventario-puntos', queryString);
    this.Cargando_Tabla = true;
    this.http
      .get(this.globales.ruta + '/php/inventario_nuevo/filter_inventario.php', { params: params })
      .subscribe((data: any) => {
        this.Cargando_Tabla = false;
        this.Inventarios = data.inventarios;
        this.pagination.length = data.numReg;
        this.dividirEstibas();
      });
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.filtro_fecha = event;
    } else {
      this.filtro_fecha = '';
    }

    this.filtro();
  }
  paginasGuardadas = [];
  filtro() {
    let params: any = {};

    if (
      this.filtro_nom != '' ||
      this.filtro_lab != '' ||
      this.filtro_lote != '' ||
      this.filtro_cant != '' ||
      this.filtro_cant_sel != '' ||
      this.filtro_cum != '' ||
      this.filtro_fecha != '' ||
      this.filtro_cant_apar != '' ||
      this.filtro_bod != '' ||
      this.filtro_lab_gen != '' ||
      this.filtro_invima != '' ||
      this.filtro_grupo != '' ||
      this.lista_informe != 0 ||
      this.filtro_iva != ''
    ) {
      params.sin_inventario = this.filtro_sin_inventario;
      params.pag = this.pagination.page;

      if (this.subtipo_punto != undefined) {
        params.tipo = this.tipo_punto;

        if (this.subtipo_punto != '') {
          params.id = this.subtipo_punto;
        }
      }

      if (this.filtro_nom != '') {
        params.nom = this.filtro_nom;
      }
      if (this.filtro_lab != '') {
        params.lab = this.filtro_lab;
      }
      if (this.filtro_lote != '') {
        params.lote = this.filtro_lote;
      }
      if (this.filtro_cum != '') {
        params.cum = this.filtro_cum;
      }
      if (this.filtro_bod != '') {
        params.bod = this.filtro_bod;
      }
      if (this.filtro_lab_gen != '') {
        params.lab_gen = this.filtro_lab_gen;
      }
      if (this.filtro_invima != '') {
        params.invima = this.filtro_invima;
      }
      if (this.filtro_grupo != '') {
        params.grupo = this.filtro_grupo;
      }
      if (this.filtro_cant != '' && this.filtro_cant != null) {
        params.cant = this.filtro_cant;
      }
      if (this.filtro_cant_apar != '' && this.filtro_cant_apar != null) {
        params.cant_apar = this.filtro_cant_apar;
      }
      if (this.filtro_cant_sel != '' && this.filtro_cant_sel != null) {
        params.cant_sel = this.filtro_cant_sel;
      }
      if (this.filtro_fecha) {
        params.fecha = this.filtro_fecha;
      }
      if (this.lista_informe != 0) {
      }
      if (this.filtro_iva != '' && this.filtro_iva != null) {
        params.iva = this.filtro_iva;
      }

      if (this.bodega_selected != '' && this.bodega_selected != null) {
        params.id_bodega_nuevo = this.bodega_selected;
      }
      if (this.bodega_selected != '' && this.bodega_selected != null) {
        params.id_bodega_nuevo = this.bodega_selected;
      }
      this.parametrosConsulta = params;
      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/inventario/inventario-puntos', queryString);
      this.Cargando_Tabla = true;
      this.http
        .get(this.globales.ruta + 'php/inventario_nuevo/filter_inventario.php?' + queryString)
        .subscribe((data: any) => {
          this.Inventarios = data.inventarios;
          this.pagination.length = data.numReg;
          this.Cargando_Tabla = false;
          this.dividirEstibas();
        });
    } else {
      this.filtro_lab = '';
      this.filtro_lote = '';
      this.filtro_nom = '';
      this.filtro_cant = '';
      this.filtro_cant_sel = '';
      this.filtro_fecha = '';
      this.filtro_cant_apar = '';
      this.filtro_bod = '';
      this.filtro_lab_gen = '';
      this.filtro_invima = '';
      this.filtro_grupo = '';
      this.filtro_iva = '';

      this.buscar_productos();
    }
  }

  Tipo(tipo, subtipo?) {
    if (tipo == 'Bodega') {
      this.http
        .get(this.globales.ruta + 'php/inventario/bodega_punto.php', {
          params: { bod: 'Bodega' },
        })
        .subscribe((data: any) => {
          this.categorias_nuevas = data;

          if (subtipo != '') {
            this.subtipo_punto = subtipo;
          }
        });
    } else {
      this.categorias_nuevas = [];
    }
  }

  customTipo(tipo, subtipo) {
    this.http
      .get(this.globales.ruta + 'php/inventariopuntos/lista_punto_funcionario.php', {
        params: { id: this.id_funcionario },
      })
      .subscribe((data: any) => {
        this.puntosArray = data.Puntos;
      });
  }

  Archivo(event) {
    if (event.target.files.length === 1) {
      this.csv = event.target.files[0];
    }
  }

  actualiza_filtro(txt, col, tipo) {
    const val = txt.target.value.toLowerCase();
    const temp = this.tempFilter.filter(function (d) {
      if (tipo === '=') {
        return d[col].toLowerCase().indexOf(val) !== -1 || !val;
      } else if (tipo === '!=') {
        return d[col].toLowerCase().indexOf(val) === -1;
      }
    });
    this.rowsFilter = temp;
    // this.table.offset = 0;
  }

  verApartadas(id, i, modal: any) {
    this.Apartadas = [];
    this.nombre_producto = this.Inventarios[i].Nombre_Comercial;
    this.lote_producto = this.Inventarios[i].Lote;
    this.fecha_venc_producto = this.Inventarios[i].Fecha_Vencimiento;
    this.isSelected = false;
    this.modalService.open(modal, { size: 'lg' });
    this.Cargando_Apartadas = true;

    this.http
      .get(this.globales.base_url + '/php/inventario_nuevo/ver_apartadas.php', {
        params: { id_inventario_nuevo: id },
      })
      .subscribe((data: any) => {
        this.Cargando_Apartadas = false;
        this.Apartadas = data;
      });
  }

  verSeleccionadas(inventario, modal) {
    this.Apartadas = [];
    this.nombre_producto = inventario.Nombre_Producto;
    this.lote_producto = inventario.Lote;
    this.fecha_venc_producto = inventario.Fecha_Vencimiento;
    this.isSelected = true;
    this.modalService.open(modal, { size: 'lg' });
    this.Cargando_Seleccionados = true;

    this.http
      .get(this.globales.base_url + '/php/inventario_nuevo/ver_seleccionados.php', {
        params: {
          Id_Bodega_Nuevo: inventario.Id_Bodega_Nuevo,
          Id_Producto: inventario.Id_Producto,
        },
      })
      .subscribe((data: any) => {
        this.Cargando_Seleccionados = false;
        this.Seleccionados = data;
      });
  }

  verCompras(id, i) {
    this.Compras = [];
    this.nombre_producto = (
      document.getElementById('NombreProducto' + i) as HTMLInputElement
    ).value;
    this.lote_producto = (document.getElementById('LoteProducto' + i) as HTMLInputElement).value;
    this.fecha_venc_producto = (
      document.getElementById('Fecha_Venc' + i) as HTMLInputElement
    ).value;

    this.modalCompras.show();
    this.Cargando_Compras = true;

    this.http
      .get(this.globales.base_url + '/php/inventario/ver_compras.php', {
        params: { id_producto: id },
      })
      .subscribe((data: any) => {
        this.Cargando_Compras = false;
        this.Compras = data;
      });
  }

  DescargaExcel() {
    let params: any = {};
    this.subtipo_punto ? (params.id = this.subtipo_punto) : 0;
    params.id_bodega_nuevo = this.bodega_selected;
    params.funcionario = this.id_funcionario;
    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
    window.open(
      this.globales.ruta + 'php/archivos/descarga_inventario_by_puntos.php?' + queryString,
      '_blank',
    );
  }

  dividirEstibas() {
    this.Inventarios.forEach((inv) => {
      let a: string = inv.Nombre_Estiba;
      let estibas = a.split(',').map((estiba) => estiba.split(':'));
      inv.Nombre_Estiba = estibas
        .map((estiba) => {
          return this.permisos?.Editar == '1' ? `${estiba[0]} :${estiba[1]}` : `${estiba[0]}`;
        })
        .join(',');
    });
  }
}

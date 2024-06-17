import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  DatePipe,
  Location,
  NgIf,
  NgClass,
  NgFor,
  DecimalPipe,
  CurrencyPipe,
} from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbDropdownConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/core/services/modal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { HeaderDownloadComponent } from '@shared/components/standard-components/header-download/header-download.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { CategoriasService } from '@app/pages/ajustes/informacion-base/empresas/company-configuration/components/categorias/categorias.service';
import { ProductNameComponent } from '@shared/components/product-name/product-name.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    HeaderDownloadComponent,
    TableComponent,
    NgIf,
    NgClass,
    DropdownActionsComponent,
    ActionButtonComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    NgFor,
    MatButtonModule,
    MatIconModule,
    NotDataComponent,
    RouterLink,
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
    MatExpansionModule,
    MatListModule,
    ProductNameComponent,
    NgbPopoverModule,
  ],
})
export class InventarioComponent implements OnInit {
  datePipe: any = new DatePipe('es-CO');
  bodegas_nuevo: any[] = [];
  Inventarios: any[] = [];
  tempFilter: any[] = [];
  columns: any[] = [];
  bodegas: any[] = [];
  Compras: any[] = [];
  Cargando_Seleccionados: boolean = false;
  Cargando_Compras: boolean = false;
  loadingIndicator: boolean = true;
  cargando: boolean = false;
  baseUrl = environment.base_url;
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  public bodega_selected: any = 0;
  public user = { Identificacion_Funcionario: '1' };

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
  public Cargando_Tabla = false;
  public Cargando_Apartadas = false;

  public listas = [];
  public lista_informe = 1;
  date: { year: number; month: number };
  public tipo_punto: string = 'Bodega';
  public filtrando: boolean = false;

  public nombre_producto: string = '';
  public lote_producto: string = '';
  public fecha_venc_producto: string = '';
  public Apartadas: any = [];

  public filtro_sin_inventario: boolean = true;

  csv: any;
  Seleccionados: any = [];
  CargandoDetalleContrato: boolean = false;
  DetalleContrato: any = [];

  categories: any[] = [];

  categoryService = inject(CategoriasService);

  loadingCategories: boolean = false;

  selectedCategory: any = {
    categoria: {
      id: '',
      nombre: '',
    },
    subcategoria: {
      id: '',
      nombre: '',
    },
  };

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    public dropConfig: NgbDropdownConfig,
    private _modal: ModalService,
  ) {
    dropConfig.placement = 'left-top';
  }

  ngOnInit() {
    this.getListaGenerales();
    this.ListarInventario(true);
    this.getCategories();
    this.getBodegas();
  }

  getCategories() {
    this.loadingCategories = true;
    this.categoryService.getCategorias().subscribe((res: any) => {
      this.categories = res.data;
      this.loadingCategories = false;
    });
  }

  getBodegas() {
    this.http
      .get(environment.base_url + '/php/bodega_nuevo/get_bodegas.php')
      .subscribe((data: any) => {
        if (data.Tipo == 'success') this.bodegas_nuevo = data.Bodegas;
      });
  }

  getListaGenerales() {
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Lista_Ganancia' },
      })
      .subscribe((data: any) => {
        this.listas = data;
      });
  }

  openConfirm(confirm) {
    this._modal.open(confirm, 'lg');
  }

  selectedDate(fecha) {
    this.filtro_fecha =
      this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd');
    this.filtro();
  }

  ListarInventario(primeraVez = false) {
    let params = Object.assign({}, this.route.snapshot.queryParams);
    if (!params.lista) {
      params.lista = 1;
    }
    let queryString = '';
    if (Object.keys(params).length > 0 || primeraVez) {
      this.tipo_punto = params.tipo ? params.tipo : '';
      this.filtro_nom = params.nom ? params.nom : '';
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
      .get(environment.base_url + '/php/inventario_nuevo/lista_inventario.php' + queryString)
      .subscribe((data: any) => {
        this.Cargando_Tabla = false;
        this.Inventarios = data.inventarios;
        this.pagination.length = data.numReg;
      });
  }

  verContrato(inventario, i, modal) {
    this.openConfirm(modal);
    this.CargandoDetalleContrato = true;
    this.http
      .get(environment.base_url + '/php/inventario_nuevo/ver_inventario_contrato.php', {
        params: { Id_Inventario_Nuevo: inventario },
      })
      .subscribe((data: any) => {
        this.DetalleContrato = data;
        this.CargandoDetalleContrato = false;
      });
  }

  limpiarContrato() {
    this.DetalleContrato = [];
  }

  buscar_productos() {
    this.AsignarValorSinInventario();
    let params: any = {
      pag: 1,
      pageSize: 10,
      tipo: this.tipo_punto,
      lista: this.lista_informe,
      id_bodega_nuevo: this.bodega_selected,
      sin_inventario: this.filtro_sin_inventario,
    };
    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
    this.location.replaceState('/inventario/inventario', queryString);
    this.Cargando_Tabla = true;
    this.filtrando = true;
    this.http
      .get(environment.base_url + '/php/inventario_nuevo/lista_inventario.php?' + queryString)
      .subscribe((data: any) => {
        this.Cargando_Tabla = false;
        this.Inventarios = data.inventarios;
        this.pagination.length = data.numReg;
      });
    // } else {
    //   this.location.replaceState('/inventario', '?sin_inventario='+this.filtro_sin_inventario);
    //   this.http.get(environment.base_url+ '/php/inventario_nuevo/lista_inventario.php?sin_inventario='+this.filtro_sin_inventario).subscribe((data:any) => {
    //     this.Cargando_Tabla = false;
    //     this.Inventarios = data.inventarios;
    //     this.TotalItems = data.numReg;
    //     this.page = 1;
    //   });
    this.filtrando = false;
    // }
  }

  paginacion() {
    let params: any = {
      pag: this.pagination.page,
      pageSize: this.pagination.pageSize,
    };
    params.sin_inventario = this.filtro_sin_inventario;
    if (this.filtro_nom != '') {
      params.nom = this.filtro_nom;
    }
    if (this.filtro_lab != '') {
      params.lab = this.filtro_lab;
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
    if (this.filtro_fecha != '' && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha;
    }
    if (this.lista_informe != 0) {
      params.lista = this.lista_informe;
    }
    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
    this.location.replaceState('/inventario/inventario', queryString);
    this.Cargando_Tabla = true;
    this.http
      .get(environment.base_url + '/php/inventario_nuevo/lista_inventario.php?' + queryString)
      .subscribe((data: any) => {
        this.Cargando_Tabla = false;
        this.Inventarios = data.inventarios;
        this.pagination.length = data.numReg;
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

  filtro() {
    this.AsignarValorSinInventario();
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
      this.lista_informe != 0
    ) {
      params.sin_inventario = this.filtro_sin_inventario;
      params.pag = this.pagination.page;
      params.pageSize = this.pagination.pageSize;

      if (this.filtro_nom != '') {
        params.nom = this.filtro_nom;
      }
      if (this.filtro_lab != '') {
        params.lab = this.filtro_lab;
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
      if (this.filtro_fecha != '' && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha;
      }
      if (this.lista_informe != 0) {
        params.lista = this.lista_informe;
      }

      if (this.bodega_selected != '' && this.bodega_selected != null) {
        params.id_bodega_nuevo = this.bodega_selected;
      }
      if (this.bodega_selected != '' && this.bodega_selected != null) {
        params.id_bodega_nuevo = this.bodega_selected;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/inventario/inventario', queryString);
      this.Cargando_Tabla = true;
      this.http
        .get(environment.base_url + '/php/inventario_nuevo/lista_inventario.php?' + queryString)
        .subscribe((data: any) => {
          this.Inventarios = data.inventarios;
          this.pagination.length = data.numReg;
          this.Cargando_Tabla = false;
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

      this.buscar_productos();
    }
  }
  Archivo(event) {
    if (event.target.files.length === 1) {
      this.csv = event.target.files[0];
    }
  }
  // ImportarArchivo(formulario: NgForm){

  //   let info = JSON.stringify(formulario.value);
  //   let datos = new FormData();
  //   let fun = JSON.parse(localStorage.getItem("User"));
  //   datos.append("id_func", fun.Identificacion_Funcionario);
  //   datos.append("datos", info);
  //   datos.append('Archivo', this.csv );
  //   this.cargando = true;
  //   this.http.post(environment.ruta+ 'php/inventario/invnetario_inicial/generar_inventario_inicial_csv.php', datos).subscribe(
  //     (data: any) => {
  //     if(data){
  //       this.cargando=false;
  //       formulario.reset();
  //       this.modalInventario.hide();
  //       this.confirmacionSwal.title=data.Titulo;
  //       this.confirmacionSwal.html= data.Mensaje;
  //       this.confirmacionSwal.type= data.Tipo;
  //       this.confirmacionSwal.show();
  //     }else{
  //       this.cargando=false;
  //       this.confirmacionSwal.title='Error de Conexión';
  //       this.confirmacionSwal.html= 'Error con los tiempos de respuesta del Servidor';
  //       this.confirmacionSwal.type= 'error';
  //       this.confirmacionSwal.show();
  //     }

  //   });
  // }

  verApartadas(id, i, modal) {
    this.Apartadas = [];
    this.nombre_producto = (
      document.getElementById('NombreProducto' + i) as HTMLInputElement
    ).value;

    this.openConfirm(modal);
    this.Cargando_Apartadas = true;

    this.http
      .get(environment.base_url + '/php/inventario_nuevo/ver_apartadas.php', {
        params: { id_inventario_nuevo: id },
      })
      .subscribe((data: any) => {
        this.Cargando_Apartadas = false;
        this.Apartadas = data;
      });
  }
  verSeleccionadas(inventario, i, modal) {
    this.Apartadas = [];
    this.nombre_producto = inventario.Nombre_Producto;
    this.lote_producto = inventario.Lote;
    this.fecha_venc_producto = inventario.Fecha_Vencimiento;
    this.openConfirm(modal);
    this.Cargando_Seleccionados = true;

    this.http
      .get(environment.base_url + '/php/inventario_nuevo/ver_seleccionados.php', {
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
  verCompras(id, i, modal) {
    this.Compras = [];
    this.nombre_producto = (
      document.getElementById('NombreProducto' + i) as HTMLInputElement
    ).value;
    this.openConfirm(modal);
    this.Cargando_Compras = true;

    this.http
      .get(environment.base_url + '/php/inventario/ver_compras.php', {
        params: { id_producto: id },
      })
      .subscribe((data: any) => {
        this.Cargando_Compras = false;
        this.Compras = data;
      });
  }
  DescargaExcel() {
    let params: any = {};

    params.id_bodega_nuevo = this.bodega_selected;
    // }
    params.funcionario = this.user.Identificacion_Funcionario;
    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    window.open(
      environment.ruta + 'php/inventario_nuevo/descargar_excel.php?' + queryString,
      '_blank',
    );
  }
  AsignarValorSinInventario() {
    var check = $('#sin-inventario').is(':checked');
    this.filtro_sin_inventario = check;
  }
}

import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Location, NgFor, NgClass, NgIf, DatePipe } from '@angular/common';
import { debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DotacionService } from '../dotacion.service';
import { PersonService } from '../../../ajustes/informacion-base/services/person/person.service';
import { consts } from 'src/app/core/utils/consts';
import moment from 'moment';
import { ChartDataset, ChartType } from 'chart.js';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteMdlComponent } from '../../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { TableStockComponent } from './table-stock/table-stock.component';
import { FormsModule } from '@angular/forms';
import { ModalBasicComponent } from '../../../../components/modal-basic/modal-basic.component';
import { TableInventaryComponent } from './table-inventary/table-inventary.component';

@Component({
  selector: 'app-dotaciones',
  templateUrl: './dotaciones.component.html',
  styleUrls: ['./dotaciones.component.scss'],
  standalone: true,
  imports: [
    TableInventaryComponent,
    ModalBasicComponent,
    NgFor,
    FormsModule,
    TableStockComponent,
    AutocompleteMdlComponent,
    NgClass,
    NgIf,
    NgbTooltip,
    NotDataComponent,
    DatePipe,
  ],
})
export class DotacionesComponent implements OnInit {
  openModal = new EventEmitter<any>();
  openModalSalidas = new EventEmitter<any>();

  @ViewChild('confirmacionEntrega') private confirmacionEntrega;
  @ViewChild('confirmacionDevolucion') private confirmacionDevolucion;
  @ViewChild('tablestock') private tablestock;
  @ViewChild('modalEntrega') modalEntrega: any;
  @ViewChild('modalDevolver') modalDevolver: any;

  @Output('getDatos') getDatos = new EventEmitter();

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  };
  loading = false;

  people: any[] = [];

  filtros: any = {
    cod: '',
    type: '',
    recibe: '',
    entrega: '',
    name: '',
    description: '',
    fechaD: '',
    delivery: '',
  };

  public fecha: Date = new Date();
  public filtro_fecha: any = '';
  public filtro_cod: string = '';
  public filtro_tip: string = '';
  public filtro_entrega: string = '';
  public filtro_recibe: string = '';
  public filtro_detalles: string = '';
  public filtro_valor: string = '';
  public Totales = 0;
  public TotalesMes = 0;
  public SumaMes = 0;
  public prefijoCodigo: string = 'ED00';
  public flagDotacionApp: string = '';

  selectedMes: string;
  public Meses = consts.meses;
  public Lista_Dotaciones: any = [];
  public Lista_Grupos: any[] = [];
  public Lista_Grupos_Inventario: any = [];
  public Lista_Grupos_Inventario1: any = [];
  public Lista_Grupos_Inventario_Epp: any = [];
  public Pro_Van: any = {
    Empleado: '',
    Fecha: '',
    prod: [],
    description: '',
  };

  public Cargando: boolean = true;
  public cam: boolean = false;

  /*  public func : any  = JSON.parse(localStorage.getItem('User')); */
  public Empleado_Entrega: any = [];
  public Entrega: any = {
    person_id: '',
    cost: 0,
    code: '',
    description: '',
    type: '',
  };
  public Devolucion: any = {
    Detalles: '',
    Entrega: '',
    Recibe: '',
    dispatched_at: '',
  };
  public alertOptionEntrega: any;
  public alertOptionDevolucion: any;

  public Empleados: any[] = [];
  public Productos: any[] = [];
  public Productos_Devolver: any[] = [];
  public personas: any = [];
  public valores: any = [];

  public CantidadTotal: 0;
  public totalCategory: any = [];

  public tableInventoryComponent: any = [];

  public studentChartData: any;
  public studentChartOption: any;
  @ViewChild('dotacion_chart') dotacion_chart: ElementRef;
  public facturacionChartTag: CanvasRenderingContext2D;

  constructor(
    private _dotation: DotacionService,
    private location: Location,
    private _person: PersonService,
    private _swal: SwalService,
  ) {}

  //ngbNavItem
  active = 1;

  formatter4 = (x: { Nombres: string }) => x.Nombres;
  search4 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 1
          ? []
          : this.Empleados.filter(
              (v) => v.Nombres.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 100),
      ),
    );
  ngOnInit() {
    this.selectedMes = moment().format('Y-MM');
    this.listarTotales(this.selectedMes);
    this.listarGrupos();
    this.Graficar();
    this.Lista_Productos();
    this.stockGroup();
    this.getStokEpp();
  }

  closeModal() {
    this.modalEntrega.hide();
    this.ListarDotaciones();
    // this.flagDotacionApp = ''
  }

  getPeople() {
    this._person.getAll({}).subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: 0 });
    });
  }

  listarEntradas(l) {
    this.openModal.next({ data: l });
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.filtros.fechaD = event.formatted;
      this.ListarDotaciones();
    } else {
      this.filtros.fechaD = '';
      this.ListarDotaciones();
    }
  }

  ListarDotaciones(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this._dotation.getDotations(params).subscribe((r: any) => {
      this.Lista_Dotaciones = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }

  // this._dotation.getDotations(params).subscribe((r: any) => {
  //   this.Lista_Dotaciones = r.data.data;
  //   this.pagination.collectionSize = r.data.total;
  //   this.loading = false
  // })

  Lista_Empleados() {
    this._person.getPeopleIndex().subscribe((r: any) => {
      this.Empleados = r.data;
    });
  } ///FINAL LISTAR EMPLEADOS
  Lista_Productos() {
    /* this.http.get(this.globales.base_url + '/php/lista_generales.php', { params: { modulo: 'Inventario_Dotacion' } }).subscribe((data: any) => {
    this.Productos = data;
    }); */
  } /// FINAL LISTA PRODUCTOS
  TraerProductos(Id_producto) {
    //this.http.get(this.globales.ruta + 'php/dotaciones/lista_productos')
  }
  public barChartOptions: any = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabels: any = ['Categorías'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  /*   public barChartPlugins = [pluginDataLabels]; */

  public barChartData: ChartDataset[] = [];

  graphicData: any = {};

  Graficar() {
    this._dotation.getDotationTotalByCategory({ cantMes: this.selectedMes }).subscribe((d: any) => {
      let totals: any[] = d.data;

      if (totals) {
        this.barChartData = totals.reduce((acc, el) => {
          let daSet = { data: [el.value], label: [el.name] };
          return [...acc, daSet];
        }, []);
      }
    });
  }
  listarGrupos() {
    this._dotation.getProductDotationTypes().subscribe((data: any) => {
      this.Lista_Grupos = data.data;
    });
  }
  // metodo para listar en pantalla principal
  stockGroup() {
    this._dotation.getInventaryGroupByCategory().subscribe((r: any) => {
      this.Lista_Grupos_Inventario = r.data;
    });
  }

  // metodo para listar en el modal
  // onChange1() {

  //   this.loading = true;
  //   this._dotation.getStok().subscribe((r: any) => {
  //     this.Lista_Grupos_Inventario1 = r.data;
  //     this.loading = false;
  //   });
  // }

  getStokEpp() {
    this._dotation.getStokEpp().subscribe((r: any) => {
      this.Lista_Grupos_Inventario_Epp = r.data;
    });
  }

  cambio(prod) {
    Object.keys(prod).forEach((x) => {
      if (prod['quantity'] > prod['Cantidad']) {
        this.cam = true;
      } else {
        this.cam = false;
      }
    });
  }
  maxLengthCheck(object) {
    if (object.value.max > object.max) object.value = object.value.slice(0, object.max);
  }
  listarTotales(cantMes) {
    this._dotation.getCuantityDispatched({ cantMes }).subscribe((r: any) => {
      this.TotalesMes = r.data.month.totalMes;
      this.SumaMes = r.data.month.totalCostoMes;

      this.CantidadTotal = r.data.year.totalAnual;
      this.Totales = r.data.year.totalCostoAnual;
    });
  }
  // ListarDotaciones(page = 1) {
  //   this.pagination.page = page;
  //   let params = this.route.snapshot.queryParams;
  //   let queryString = '';
  //   if (Object.keys(params).length > 0) { // Si existe parametros o filtros
  //     // actualizando la variables con los valores de los paremetros.
  //     this.pagination.page = params.pag ? params.pag : 1;
  //     this.filtro_fecha = params.fecha ? params.fecha : '';
  //     this.filtro_cod = params.cod ? params.cod : '';
  //     this.filtro_tip = params.tip ? params.tip : '';
  //     this.filtro_entrega = params.entrega ? params.entrega : '';
  //     this.filtro_recibe = params.recibe ? params.recibe : '';
  //     this.filtro_detalles = params.detalles ? params.detalles : '';
  //     this.filtro_valor = params.valor ? params.valor : '';

  //     queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
  //   }

  //   params = this.pagination
  //   this.loading = true;
  //   this._dotation.getDotations(params).subscribe((r: any) => {
  //     this.Lista_Dotaciones = r.data.data;
  //     this.pagination.collectionSize = r.data.total;
  //     this.loading = false
  //   })
  // }
  // filtros() {
  //   let params: any = {};
  //   this.pagination.page = 1;
  //   params.pag = this.pagination.page;

  //   if (this.filtro_fecha != "" && this.filtro_fecha != null) {
  //     params.fecha = this.filtro_fecha;
  //   }
  //   if (this.filtro_cod != "") {
  //     params.cod = this.filtro_cod;
  //   }
  //   if (this.filtro_tip != "") {
  //     params.tip = this.filtro_tip;
  //   }
  //   if (this.filtro_entrega != "") {
  //     params.entrega = this.filtro_entrega;
  //   }
  //   if (this.filtro_recibe != "") {
  //     params.recibe = this.filtro_recibe;
  //   }
  //   if (this.filtro_detalles != "") {
  //     params.detalles = this.filtro_detalles;
  //   }
  //   if (this.filtro_valor != "") {
  //     params.valor = this.filtro_valor;
  //   }

  //   let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

  //   this.location.replaceState('/dotacion', queryString);

  //   this.Cargando = true;
  //   /*  this.http.get(this.globales.ruta + 'php/dotaciones/lista_dotaciones.php?'+queryString).subscribe((data: any) => {
  //      this.Cargando = false;
  //      this.Lista_Dotaciones = data.Listado;
  //      this.TotalItems = data.Totales.Cantidad;
  //      this.Totales = data.Totales;
  //      this.CantidadTotal = data.costs.Totalescosts;

  //    }); */
  // }
  showAlert4(evt: any) {
    this.confirmacionEntrega.show();
  }
  showAlert5(evt: any) {
    this.confirmacionDevolucion.show();
  }
  devolverDotacion(id) {
    /*  this.http.get(this.globales.ruta + 'php/dotaciones/detalle_devolucion.php?id='+id).subscribe((data: any) => {
       this.Productos_Devolver = data.Productos;
       this.Devolucion = data.Datos;
       this.modalDevolver.show();
       this.Lista_Productos();
     }); */
  }
  GuardarDevolucion() {
    this.modalDevolver.hide();
    this.Devolucion.Entrega = '';

    let datos = new FormData();
    /*  let devolucion          =  this.globales.normalize(JSON.stringify(this.Devolucion));
     let prods               =  this.globales.normalize(JSON.stringify(this.Productos_Devolver));
     datos.append("Devolucion", devolucion);
     datos.append("Productos", prods);*/
    /* this.http.post(this.globales.ruta + 'php/dotaciones/guardar_devolucion.php', datos).subscribe((data: any) => {
      this.Devolucion = {
        Detalles : '',
        Entrega :'',
        Recibe : '',
        dispatched_at : ''
      }
      this.Lista_Productos();
      this.ListarDotaciones();
      this.Swal.title = 'Devolución de Dotación Guardada Correctamente';
      this.Swal.text  = "Se ha reportado correctamente la Devolución de Dotación";
      this.Swal.type  = "success";
      this.Swal.show();

    }); */
  }
  GuardarEntrega() {
    this.Entrega.type = this.flagDotacionApp ? 'Dotacion' : 'EPP';
    let entrega = this.Entrega;

    // let prods: Array<any> = this.Lista_Grupos_Inventario1;
    let prods: Array<any> = this.flagDotacionApp
      ? this.Lista_Grupos_Inventario1
      : this.Lista_Grupos_Inventario_Epp;

    prods = prods.reduce((acc, el) => {
      let prod: Array<any> = el.inventary.filter((r) => r.quantity && r.quantity != '0');
      return prod.length == 0 ? acc : [...acc, ...prod];
    }, []);

    this._dotation.saveDotation({ entrega, prods }).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          icon: 'success',
          title: 'Operación exitosa',
          showCancel: false,
          text: 'Dotación guardada',
          timer: 1000,
        });
        this.ListarDotaciones();

        this.Entrega = {
          person_id: '',
          cost: 0,
          code: '',
          description: '',
          // type: 'Dotacion'
          type: '',
        };
      } else {
        this._swal.show({
          icon: 'error',
          title: 'Operación denegada',
          showCancel: false,
          text: r.err,
        });
      }
    });
  }

  save() {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: 'Vas a generar una nueva dotación',
      })
      .then((result) => {
        if (result.value) {
          this.GuardarEntrega();
        }
      });
  }

  configEntrega(value: string) {
    this.tablestock.search();
    this.modalEntrega.show();
    this.flagDotacionApp = value;
  }

  paginacion() {}
  anularDotacion(id) {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: 'Vas a cambiar el estado de la dotación',
      })
      .then((result) => {
        if (result.value) {
          this._dotation.setDotation({ id, data: { state: 'Anulada' } }).subscribe((r: any) => {
            if (r.code == 200) {
              this._swal.show({
                icon: 'success',
                title: 'Operación exitosa',
                showCancel: false,
                text: 'Dotación actualizada',
                timer: 1000,
              });
              this.ListarDotaciones();
            } else {
              this._swal.show({
                icon: 'error',
                title: 'Operación denegada',
                showCancel: false,
                text: r.err,
              });
            }
          });
        }
      });
  }
  aprobarDotacion(id) {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: 'Vas a aprobar la dotación',
      })
      .then((result) => {
        if (result.value) {
          this._dotation
            .approveDotation({ id, data: { state: 'Aprobado' } })
            .subscribe((r: any) => {
              if (r.code == 200) {
                this._swal.show({
                  icon: 'success',
                  title: 'Operación exitosa',
                  showCancel: false,
                  text: 'Dotación aprobada',
                  timer: 1000,
                });
                this.ListarDotaciones();
              } else {
                this._swal.show({
                  icon: 'error',
                  title: 'Operación denegada',
                  showCancel: false,
                  text: r.err,
                });
              }
            });
        }
      });
  }
}

import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
// import {
//   TableColumn,
//   ColumnMode,
//   DatatableComponent,
// } from "@swimlane/ngx-datatable";
// import { Globales } from "../../shared/globales/globales";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, NgClass } from '@angular/common';
// import { TerceroService } from "../../shared/services/terceros/tercero.service";
// import { SwalService } from "../../shared/services/swal/swal.service";
import { environment } from 'src/environments/environment';
import { SwalService } from '../services/swal.service';
import { ModalBasicComponent } from '../../../../components/modal-basic/modal-basic.component';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss', './clientes.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    ModalBasicComponent,
  ],
})
export class ClientesComponent implements OnInit {
  infoSwal: any;
  @ViewChild('modalNewAgent') modalNewAgent: any;
  public newAgent: any = {
    Id_Cliente: '',
    Nombres: '',
    Apellidos: '',
    Identificacion: '',
    Email: '',
    Celular: '',
    Telefono: '',
  };
  public createAgent = false;
  public agents: any = [];
  public clientes: any = [];
  public Documentos: any[] = [];
  public Departamentos: any[] = [];
  public Municipios: any[] = [];

  public IdCliente: any = '';

  public TipoIdentificacion: any = '';
  public Identificacion: any = '';
  public NombreCliente: any = '';
  public RazonSocial: any = '';
  public sedeNombre: any = '';
  public Cargo: any = '';
  public sedeTelefono: any = '';
  public Correo: any = '';
  public sedeDireccion: any = '';
  public Sedes: any[] = [
    {
      Nombre: '',
      Direccion: '',
      Telefono: '',
    },
  ];

  public SedesNuevas: any[] = [
    {
      Nombre: '',
      Direccion: '',
      Telefono: '',
    },
  ];

  public PesonaContacto: any = '';

  //Variables para combos en los filtros
  public ListaGananciaCliente: any[] = [];

  rowsFilter = [];
  tempFilter = [];
  columns = [];
  loadingIndicator = true;
  timeout: any;

  @ViewChild('FormCliente') FormCliente: any;
  @ViewChild('modalCliente') modalCliente: any;
  @ViewChild('FormClienteEditar') FormClienteEditar: any;
  @ViewChild('modalClienteEditar') modalClienteEditar: any;
  @ViewChild('PlantillaBotones') PlantillaBotones!: TemplateRef<any>;
  // @ViewChild(DatatableComponent) table: DatatableComponent;
  confirmacionSwal: any;
  errorSwal: any;

  public encabezado: any = {};
  public Departamento: any = {};
  Tipo = [];
  public Zonas: any = [];
  public TotalItems!: number;
  public page = 1;
  public pageSize = 10;
  public maxSize = 10;
  public filtro_ced: string = '';
  public filtro_nombre: string = '';
  public filtro_dir: string = '';
  public filtro_ciu: string = '';
  public filtro_nat_jur: string = '';
  public filtro_categoria: string = '';
  public filtro_zona: string = '';
  public Cargando: boolean = false;
  enviromen: any;
  constructor(
    private http: HttpClient,
    // public globales: Globales,
    private route: ActivatedRoute,
    private location: Location,
    private swalService: SwalService,
  ) {
    // private terceroService: TerceroService,
    // this.fetchFilterData((data) => {
    //   this.tempFilter = [...data];
    //   this.rowsFilter = data;
    // });

    this.ListarClientes();
  }

  ListarClientes() {
    let params = this.route.snapshot.queryParams;
    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
      this.filtro_ced = params.ced ? params.ced : '';
      this.filtro_nombre = params.nom ? params.nom : '';
      this.filtro_dir = params.dir ? params.dir : '';
      this.filtro_ciu = params.ciu ? params.ciu : '';
      this.filtro_nat_jur = params.nat_jur ? params.nat_jur : '';

      queryString =
        '?' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');
    }

    this.Cargando = true;

    this.http
      .get(environment.ruta + 'php/clientes/lista_clientes.php' + queryString)
      .subscribe((data: any) => {
        this.Cargando = false;
        this.clientes = data.clientes;
        this.TotalItems = data.numReg;
      });
  }

  ngOnInit() {
    this.enviromen = environment;
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Tipo_Documento' },
      })
      .subscribe((data: any) => {
        this.Documentos = data;
      });
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Departamento' },
      })
      .subscribe((data: any) => {
        this.Departamentos = data;
      });
    this.http
      .get(environment.ruta + 'php/clientes/lista_cliente_tipo.php')
      .subscribe((data: any) => {
        this.Tipo = data;
      });
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Lista_Ganancia' },
      })
      .subscribe((data: any) => {
        this.ListaGananciaCliente = data;
      });
    this.http.get(environment.ruta + 'php/clientes/lista_zona.php').subscribe((data: any) => {
      this.Zonas = data;
    });
  }

  buscarIdentificacion(identificacion: any) {
    this.clientes.forEach((element: any) => {
      if (parseInt(identificacion) == parseInt(element.Id_Cliente)) {
        this.confirmacionSwal.title = 'Error ';
        this.confirmacionSwal.text =
          'Este cliente ya está registrado en nuestra base de datos, verifique la cédula Por Favor.';
        this.confirmacionSwal.icon = 'error';
        this.swalService.show(this.confirmacionSwal);
        $('#identificacion_cliente').val('');
      }
    });
  }

  VerificarTipoDocumento(): boolean {
    var input = $('#tipo-documento');
    if (input.val() === '') {
      return false;
    } else {
      return true;
    }
  }

  GuardarCliente(formulario: NgForm, modal: any) {
    let info = JSON.stringify(formulario.value);
    let sedes = JSON.stringify(this.Sedes);
    let datos = new FormData();
    datos.append('modulo', 'Cliente');
    datos.append('datos', info);
    datos.append('sedes', sedes);
    // modal.hide();
    this.CerrarModal(modal);
    this.http
      .post(environment.ruta + '/php/clientes/guardar_cliente.php', datos)
      .subscribe((data: any) => {
        formulario.reset();
        this.clientes = data;
        // this.fetchFilterData((db) => {
        //   this.tempFilter = [...db];
        //   this.rowsFilter = db;
        // });
        this.ListarClientes();
        this.page = 1;
      });
    this.encabezado = [];

    this.Departamento = [];
  }

  paginacion() {
    let params: any = {
      pag: this.page,
    };

    if (this.filtro_ced != '') {
      params.ced = this.filtro_ced;
    }
    if (this.filtro_nombre != '') {
      params.nom = this.filtro_nombre;
    }
    if (this.filtro_dir != '') {
      params.dir = this.filtro_dir;
    }
    if (this.filtro_ciu != '') {
      params.ciu = this.filtro_ciu;
    }
    if (this.filtro_nat_jur != '') {
      params.nat_jur = this.filtro_nat_jur;
    }
    if (this.filtro_zona != '') {
      params.zona = this.filtro_zona;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/base/clientes', queryString);

    this.Cargando = true;
    this.clientes = [];

    this.http
      .get(environment.ruta + '/php/clientes/lista_clientes.php?' + queryString)
      .subscribe((data: any) => {
        this.Cargando = false;
        this.clientes = data.clientes;
        this.TotalItems = data.numReg;
      });
  }

  filtros() {
    let params: any = {};

    if (
      this.filtro_ced != '' ||
      this.filtro_nombre != '' ||
      this.filtro_dir != '' ||
      this.filtro_ciu != '' ||
      this.filtro_nat_jur != '' ||
      this.filtro_zona != ''
    ) {
      this.page = 1;
      params.pag = this.page;

      if (this.filtro_ced != '') {
        params.ced = this.filtro_ced;
      }
      if (this.filtro_nombre != '') {
        params.nom = this.filtro_nombre;
      }
      if (this.filtro_dir != '') {
        params.dir = this.filtro_dir;
      }
      if (this.filtro_ciu != '') {
        params.ciu = this.filtro_ciu;
      }
      if (this.filtro_nat_jur != '') {
        // console.log(this.filtro_nat_jur);
        params.nat_jur = this.filtro_nat_jur;
      }
      if (this.filtro_zona != '') {
        params.zona = this.filtro_zona;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/base/clientes', queryString);

      this.Cargando = true;
      this.clientes = [];

      this.http
        .get(environment.ruta + '/php/clientes/lista_clientes.php?' + queryString)
        .subscribe((data: any) => {
          this.Cargando = false;
          this.clientes = data.clientes;
          this.TotalItems = data.numReg;
        });
    } else {
      this.location.replaceState('/base/clientes', '');

      this.page = 1;
      this.filtro_ced = '';
      this.filtro_ciu = '';
      this.filtro_nat_jur = '';
      this.filtro_nombre = '';
      this.filtro_dir = '';

      this.Cargando = true;
      this.clientes = [];

      this.http
        .get(environment.ruta + '/php/clientes/lista_clientes.php')
        .subscribe((data: any) => {
          this.Cargando = false;
          this.clientes = data.clientes;
          this.TotalItems = data.numReg;
        });
    }
  }

  EditarCliente(id: any) {
    this.http
      .get(environment.ruta + '/php/clientes/detalle_cliente.php', {
        params: { modulo: 'Cliente', id: id },
      })
      .subscribe((data: any) => {
        if (data === null) {
          this.errorSwal.title = 'Error ';
          this.errorSwal.text =
            'No ha sido posible cargar los datos de este cliente, contacte con el administrador del sistema!';
          this.errorSwal.icon = 'error';
          this.swalService.show(this.errorSwal);
          return;
        }

        this.IdCliente = id;
        this.encabezado = data.encabezado;
        if (data.sede.length > 0) {
          this.Sedes = data.sede;
          this.AgregaSede('a');
        }
        // console.log(this.Sedes);
        this.Departamento = data.departamento;
        this.Municipios_Departamento(data.departamento.Id_Departamento);
        this.modalClienteEditar.show();
      });
  }

  EliminarCliente(id: any) {
    let datos = new FormData();
    datos.append('modulo', 'Cliente');
    datos.append('id', id);
    this.http
      .post(environment.ruta + 'php/clientes/anular_cliente.php', datos)
      .subscribe((data: any) => {
        this.swalService.show({
          title: 'Cliente Inactivado',
          text: 'Se ha Inactivado Correctamente el Cliente',
          icon: 'success',
        });
        // this.fetchFilterData((data) => {
        //   this.tempFilter = [...data];
        //   this.rowsFilter = data;
        // });
      });
  }

  Municipios_Departamento(Departamento: any) {
    this.http
      .get(environment.ruta + 'php/genericos/municipios_departamento.php', {
        params: { id: Departamento },
      })
      .subscribe((data: any) => {
        this.Municipios = data;
      });
  }

  AgregaSede(inputValue: string) {
    if (inputValue === '') {
      if (this.Sedes.length === 1) {
        return;
      } else {
        this.Sedes.pop();
      }
    } else {
      this.Sedes.push({
        Nombre: '',
        Direccion: '',
        Telefono: '',
      });
    }
  }

  // fetchFilterData(cb) {
  //   const req = new XMLHttpRequest();
  //   req.open('GET', environment.ruta+'php/clientes/lista_clientes.php');

  //   req.onload = () => {
  //     cb(JSON.parse(req.response));
  //   };

  //   req.send();
  // }

  onPage(event: any) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      // console.log('paged!', event);
    }, 100);
  }

  actualiza_filtro(txt: any, col: any, tipo: any) {
    const val = txt.target.value.toLowerCase();
    const temp = this.tempFilter.filter(function (d: any) {
      if (tipo === '=') {
        return d[col].toLowerCase().indexOf(val) !== -1 || !val;
      } else if (tipo === '!=') {
        return d[col].toLowerCase().indexOf(val) === -1;
      }
    });
    this.rowsFilter = temp;
    // this.table.offset = 0;
  }

  actualiza_filtro_dinamico(txt: any, col: any, tipo: any) {
    const val = txt.toLowerCase();
    const temp = this.tempFilter.filter(function (d: any) {
      if (tipo === '=') {
        return d[col].toLowerCase().indexOf(val) !== -1 || !val;
      } else if (tipo === '!=') {
        return d[col].toLowerCase().indexOf(val) === -1;
      }
    });
    this.rowsFilter = temp;
    // this.table.offset = 0;
  }

  LimpiarSedes() {
    this.Sedes = [
      {
        Nombre: '',
        Direccion: '',
        Telefono: '',
      },
    ];
  }

  CerrarModal(modal: any) {
    modal.hide();
    this.LimpiarSedes();
  }

  mostrarTodos() {
    // this.fetchFilterData((data) => {
    //   this.tempFilter = [...data];
    //   this.rowsFilter = data;
    // });
  }

  // cambiarEstado(id) {
  //   this.terceroService
  //     .cambiarEstadoTercero("Cliente", id)
  //     .subscribe((data: any) => {
  //       this.swalService.ShowMessage(data);
  //       this.ListarClientes();
  //     });
  // }

  openModalAgent(idCliente: any) {
    this.newAgent.Id_Cliente = idCliente;
    this.getAgents(idCliente);
    this.modalNewAgent.show();
  }

  saveNewAgent() {
    const request = () => {
      let form = new FormData();

      form.append('agente', JSON.stringify(this.newAgent));
      this.http
        .post(environment.ruta + 'php/clientes/agentes_clientes/save.php', form)
        .subscribe((res: any) => {
          this.infoSwal.title = res.title;
          this.infoSwal.type = res.type;
          this.infoSwal.text = res.text;
          this.swalService.show(this.infoSwal);
          this.getAgents(this.newAgent.Id_Cliente);
        });
    };
    this.swalService.swalLoading('Se dispone a guardar un nuevo agente autorizado', request);
  }

  getAgents(Id_Cliente: any) {
    this.http
      .get(environment.ruta + 'php/clientes/agentes_clientes/get_agentes.php', {
        params: { Id_Cliente },
      })
      .subscribe((res) => {
        this.agents = res;
        this.createAgent = false;
      });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  NgForm,
  Validators,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RegimenService } from 'src/app/services/regimen.service';
import { DepartamentosService } from 'src/app/pages/ajustes/configuracion/localidades/services/departamentos.service';
import { TiposervicioService } from 'src/app/pages/ajustes/informacion-base/services/tiposervicio/tiposervicio.service';
import { TerceroService } from 'src/app/core/services/tercero.service';
import { DatePipe, NgIf, NgFor, NgClass, SlicePipe, DecimalPipe } from '@angular/common';
import { Observable, of, OperatorFunction } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  NgbTypeaheadSelectItemEvent,
  NgbTypeahead,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { RadicacionService } from '../radicacion.service';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { UserService } from 'src/app/core/services/user.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { RouterLink } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-formulario-radicacion',
  templateUrl: './formulario-radicacion.component.html',
  styleUrls: ['./formulario-radicacion.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgbTypeahead,
    NgIf,
    MatDatepickerModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    NgClass,
    NgbPagination,
    RouterLink,
    NotDataComponent,
    SlicePipe,
    DecimalPipe,
  ],
})
export class FormularioRadicacionComponent implements OnInit {
  @ViewChild('guardarSwal') guardarSwal: any;
  datePipe = new DatePipe('es-CO');
  formRadicacion: UntypedFormGroup;
  date: { year: number; month: number };
  filtro_fecha = '';
  filtroFactura = ''; // Viene del input que filtra en el HTML junto a al tabla de Facturas
  paginationFiltradas: any = {
    paginateData: [],
    page: 1,
    pageSize: 4,
    collectionSize: 0,
  };
  paginationSeleccionadas: any = this.paginationFiltradas;

  formatter = (cliente: any) => cliente.Nombre;
  searchingClient = false;
  searchFailedClient = false;
  selectedTiposervicio: string;

  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingClient = true)),
      switchMap((term) =>
        this.http
          .get<readonly string[]>(environment.ruta + '/php/clientes/lista_clientes.php', {
            params: { nom: term },
          })
          .pipe(
            tap(() => (this.searchFailedClient = false)),
            map((res) => res['clientes']),
            catchError(() => {
              this.searchFailedClient = true;
              return of([]);
            }),
          ),
      ),
      tap(() => (this.searchingClient = false)),
    );

  private radicacion: any = {};
  public Departamentos: any[];
  public Regimenes: any[] = [];
  public TiposServicio: any[] = [];
  public EPs: any[] = [];
  public MostrarTabla: boolean = false;
  public loading: boolean = false;
  public model: any;
  public facturas: any = {
    porRadicar: [],
    seleccionadas: [],
    filtradas: [],
  };
  public TotalInvoices: number = 0;
  public SelectedInvoices: number = this.facturas.seleccionadas.length;
  public totalValorFacturas: number = 0;
  public total_facturas = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Valor_Factura);
  public Funcionario: any;

  constructor(
    private _swal: SwalService,
    private departamentosService: DepartamentosService,
    private radicacionService: RadicacionService,
    private regimenService: RegimenService,
    private tipoServicioService: TiposervicioService,
    private _terceroService: TerceroService,
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private _user: UserService,
  ) {}

  ngOnInit() {
    this.Funcionario = this._user.user.person.id;
    this.ListarDepartamentos();
    this.createForm();
    this.GetRegimenes();
    this.GetServicios();
    this.ListarFacturas();
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end);
      }
    });
  }

  createForm() {
    this.formRadicacion = this.fb.group({
      idRadicado: [this.radicacion.Id_Radicado],
      codigo: ['', Validators.required],
      consecutivo: ['', Validators.required],
      numeroRadicacion: ['', Validators.required],
      fechaRadicacion: ['', Validators.required],
      funcionario: [this.Funcionario, Validators.required],
      cliente: ['', Validators.required],
      departamento: ['', Validators.required],
      regimen: ['', Validators.required],
      tipoServicio: ['', Validators.required],
      nomTipoServicio: ['', Validators.required],
      observacion: ['', Validators.required],
      fechaRegistro: [''],
      estado: ['PreRadicada', Validators.required],
    });
  }

  getRadicacion(data) {
    this.radicacion = { ...data };
    this.formRadicacion.patchValue({
      idRadicado: this.radicacion.Id_Radicado,
      codigo: this.radicacion.Codigo,
      consecutivo: this.radicacion.Consecutivo,
      numeroRadicacion: this.radicacion.Numero_Radicado,
      fechaRadicacion: this.radicacion.Fecha_Radicado,
      funcionario: this.Funcionario,
      cliente: this.radicacion.Id_Cliente,
      departamento: this.radicacion.Id_Departamento,
      regimen: this.radicacion.Id_Regimen,
      tipoServicio: this.radicacion.Id_Tipo_Servicio,
      nomTipoServicio: this.selectedTiposervicio,
      observacion: this.radicacion.Observacion,
      fechaRegistro: this.radicacion.Fecha_Registro,
      estado: this.radicacion.Estado,
    });
  }

  selCliente(e: NgbTypeaheadSelectItemEvent) {
    this.formRadicacion.patchValue({
      cliente: e.item.Id_Cliente,
    });
  }

  selTipoServicio(event: MatSelectChange) {
    this.selectedTiposervicio = event.source.triggerValue;
    this.formRadicacion.patchValue({ nomTipoServicio: this.selectedTiposervicio });
  }

  ListarDepartamentos() {
    this.departamentosService.getDepartments().subscribe((data: any) => {
      if (data.code == 200) {
        this.Departamentos = data.data;
      } else {
        this.Departamentos = [];
      }
    });
  }

  ListarFacturas(params = '') {
    this.loading = true;
    //this.radicacionService.getFacturasParaRadicar(params)
    this.http
      .get(environment.ruta + 'php/radicados/get_facturas_para_radicacion.php?' + params)
      .subscribe((data: any) => {
        if (data.code == 200) {
          this.facturas.porRadicar = data.query_result;
        } else {
          this.facturas.porRadicar = [];
          /* this.facturas.porRadicar = [
            {
              Id_Factura: '21',
              Codigo_Factura: 'F-021',
              Codigo_Dis: 'D-047',
              Nombre_Paciente: 'Cesar Florez',
              Valor_Factura: 450000,
              Seleccionada: '0'
            },
            {
              Id_Factura: '22',
              Codigo_Factura: 'F-022',
              Codigo_Dis: 'D-069',
              Nombre_Paciente: 'Cesar Florez',
              Valor_Factura: 450000,
              Seleccionada: '0'
            },
            {
              Id_Factura: '23',
              Codigo_Factura: 'F-023',
              Codigo_Dis: 'D-061',
              Nombre_Paciente: 'Cesar Florez',
              Valor_Factura: 450000,
              Seleccionada: '0'
            },
            {
              Id_Factura: '24',
              Codigo_Factura: 'F-024',
              Codigo_Dis: 'D-065',
              Nombre_Paciente: 'Cesar Florez',
              Valor_Factura: 450000,
              Seleccionada: '0'
            },
            {
              Id_Factura: '26',
              Codigo_Factura: 'F-025',
              Codigo_Dis: 'D-067',
              Nombre_Paciente: 'Cesar Florez',
              Valor_Factura: 450000,
              Seleccionada: '0'
            }
          ]; */
        }
        this.FiltrarFacturas();
        this.loading = false;
        //this.getRadicacionData(this.facturas.filtradas);
      });
  }

  filterByValue(array, string) {
    let camposExcluidos = ['Id_Factura'];
    return array.filter((object) =>
      Object.keys(object).some(
        (k) =>
          !camposExcluidos.includes(k) &&
          object[k].toString().toLowerCase().includes(string.toLowerCase()),
      ),
    );
  }

  FiltrarFacturas() {
    this.facturas.filtradas =
      this.filtroFactura == ''
        ? this.facturas.porRadicar
        : this.filterByValue(this.facturas.porRadicar, this.filtroFactura);
    this.TotalInvoices = this.facturas.filtradas.length;
  }

  SeleccionarFactura(idFactura, facturaFiltrada) {
    if (facturaFiltrada.Seleccionada == '0') {
      facturaFiltrada.Seleccionada = '1';
      this.facturas.seleccionadas.push(facturaFiltrada);
      let index = this.facturas.porRadicar.findIndex((x) => x.Id_Factura == idFactura);
      if (index > -1) {
        this.facturas.porRadicar[index].Seleccionada = '1';
      }
    } else {
      facturaFiltrada.Seleccionada = '0';
      let indexSelecc = this.facturas.seleccionadas.findIndex((x) => x.Id_Factura == idFactura);
      this.facturas.seleccionadas.splice(indexSelecc, 1);

      let indexRad = this.facturas.porRadicar.findIndex((x) => x.Id_Factura == idFactura);

      if (indexRad > -1) {
        this.facturas.porRadicar[indexRad].Seleccionada = '0';
      }
    }
    this.SelectedInvoices = this.facturas.seleccionadas.length;
    this.FiltrarFacturas();
    this.totalValorFacturas = this.facturas.seleccionadas.reduce(this.total_facturas, 0);
  }

  GetRegimenes(): void {
    this.http
      .get(environment.ruta + 'php/GENERALES/regimen/get_regimenes.php')
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.Regimenes = data.query_result;
        } else {
          this.Regimenes = [];
        }
      });
  }

  GetServicios(): void {
    //this.tipoServicioService.GetServiciosTipoServicio()
    this.http
      .get(environment.ruta + 'php/GENERALES/tiposervicio/get_tipos_servicio.php')
      .subscribe((data: any) => {
        this.TiposServicio = data.query_result;
      });
  }

  GetListaEps(): void {
    this._terceroService.GetEpss().subscribe((data: any) => {
      this.EPs = data;
    });
  }

  selectedDate(start, end) {
    this.filtro_fecha =
      this.datePipe.transform(start, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(end, 'yyyy-MM-dd');
  }

  registrarRadicacion() {
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Ya ha verificado la información que desea registrar?',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let data = { modelo: this.formRadicacion.value, facturas: this.facturas.seleccionadas };
          this.http
            .post(environment.ruta + 'php/radicados/guardar_radicado.php', data)
            .subscribe((data: any) => {
              //console.log(data);
            });
          this._swal.show({
            icon: 'success',
            title: 'Tarea completada con éxito!',
            text: 'Las facturas han sido radicadas con éxito.',
            timer: 1000,
            showCancel: false,
          }),
            (err) => {
              this._swal.show({
                title: 'ERROR',
                text: 'Algo impidió que se realizara la radicación, estamos trabajando en ello.',
                icon: 'error',
                showCancel: false,
              });
            };
        }
      });
  }

  /* getRadicacionData(data, pagination, page = 1, pageSize = this.facturas[data].length){
    pagination.collectionSize =  data.length;
    pagination.pageSize = pageSize;
    pagination.page =  page;
    this.facturas[data].filter(k => k >= (pagination.page - 1) * pagination.pageSize && k < pagination.page * pagination.pageSize);
    console.log(this.facturas[data]);
    this.pagination.paginateData =  data
     .slice((this.pagination.page - 1) * this.pagination.pageSize, this.pagination.page * this.pagination.pageSize);
  } */
}

import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GrupoestibaService } from '../services/grupoestiba.service';
import { BodeganuevoService } from '../services/bodeganuevo.service';
import { InventariofisicoService } from './inventariofisico.service';
import { GeneralService } from '../services/general.service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { IniciarinventarioComponent } from './iniciarinventario/iniciarinventario.component';
import { DatePipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AutocompleteMdlComponent } from '../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionViewComponent } from '../../../shared/components/standard-components/action-view/action-view.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { AutomaticSearchComponent } from '../../../shared/components/automatic-search/automatic-search.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
// import { ModalformComponent } from '../listadoinventarios/modalform/modalform.component's

@Component({
  selector: 'app-listadoinventariospuntos',
  templateUrl: './listadoinventariospuntos.component.html',
  styleUrls: ['./listadoinventariospuntos.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    AutomaticSearchComponent,
    DropdownActionsComponent,
    ActionViewComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    AutocompleteMdlComponent,
    MatSelectModule,
    MatOptionModule,
    DatePipe,
  ],
})
export class ListadoinventariospuntosComponent implements OnInit {
  public iniciarInventario = new EventEmitter<any>();
  @ViewChild('actualizaSwal') private actualizaSwal: any;
  public FiltrosTabla: any = {
    Fechas: '',
    Punto: '',
    Grupo: '',
  };

  public listaPuntos: any = [];
  public listaGrupoEstibas: any = [];
  public listaSubcategorias: any = [];
  public Inventarios_Terminados = [];
  public Documentos = [];

  public funcionario = JSON.parse(localStorage.getItem('User'));
  public miPerfil = JSON.parse(localStorage.getItem('miPerfil'));

  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };

  myDateRangePickerOptions: any = {
    width: '130px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  iniciado: boolean;
  Cargando: boolean = false;
  Cargando2: boolean = false;

  globales = environment;

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private inventariofisico: InventariofisicoService,
    private _generalService: GeneralService,
    private modalService: NgbModal,
    private _bodega: BodeganuevoService,
    private _grupoEstiba: GrupoestibaService,
  ) {}

  ngOnInit() {
    this.getDocumentosIniciados();
    this.ConsultaFiltrada();
    //buscar las bodegas existentes
    /*  */

    this.http
      .get(this.globales.ruta + 'php/entregapendientes/get_puntos.php?func=' + '1')
      .subscribe((res: any) => {
        this.listaPuntos = res;
        this.listaPuntos.unshift({ label: 'Todos', value: '' });
      });
    //buscar las bodegas existentes
    this._grupoEstiba.getGrupoEstibas().subscribe((res) => {
      if (res.Tipo == 'success') this.listaGrupoEstibas = res.Grupo_Estibas;
    });
  }

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.FiltrosTabla.Fechas = `${formatDate(this.formRange.value.start as string)} - ${formatDate(
      this.formRange.value.end as string,
    )}`;
    this.ConsultaFiltrada();
  }

  filtroBuscador = '';
  DocumentosIniciados = [];
  filtrar(event: any) {
    this.Documentos = this.DocumentosIniciados.filter((d) =>
      d.Estiba.toUpperCase().includes(this.filtroBuscador.toUpperCase()),
    );
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    this.Cargando2 = true;
    var params = this.SetFiltros(paginacion);
    this.inventariofisico.GetDocumentosTerminadosPunto(params).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Inventarios_Terminados = data.query_result;
        this.pagination.length = data.numReg;
      } else {
        this.Inventarios_Terminados = [];
      }
      this.Cargando2 = false;
    });
  }

  listarInventarioBodega() {
    this.ConsultaFiltrada();
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pagination.pageSize;

    params.pag = this.pagination.page;

    if (this.FiltrosTabla.Fechas != '' && this.FiltrosTabla.Fechas != null) {
      params.fechas = this.FiltrosTabla.Fechas;
    }

    if (this.FiltrosTabla.Punto != '') {
      params.punto = this.FiltrosTabla.Punto;
    }

    if (this.FiltrosTabla.Grupo != '') {
      params.grupo = this.FiltrosTabla.Grupo;
    }

    return params;
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.FiltrosTabla.Fechas = event.formatted;
    } else {
      this.FiltrosTabla.Fechas = '';
    }
    this.ConsultaFiltrada();
  }

  iniciar_inventario_fisico() {
    const modalRef = this.modalService.open(IniciarinventarioComponent);
    modalRef.componentInstance.Tipo = 'Punto';
    // this.iniciarInventario.next({ tipo: 'Punto' });
  }

  getDocumentosIniciados() {
    this.Cargando = true;
    this.inventariofisico.GetDocumentosIniciadosPuntos().subscribe((res) => {
      if (res.tipo == 'success') {
        this.Documentos = res.documentos;
        this.DocumentosIniciados = res.documentos;
      } else {
        this.Documentos = [];
      }
      this.Cargando = false;
    });
  }

  //funcion para ajustar el inventario(url,funcionario,Id_Doc_Inventario_Fisico) o segundo conteo, (url,funcionario,Id_Estiba)
  AccionInventario(url_api, funcionario: string, id_modelo) {
    if (funcionario == '' || funcionario.length <= 4) {
      this.actualizaSwal.title = 'Dato inválido';
      this.actualizaSwal.html = 'Lo sentimos. Debe ingresar datos correctos';
      this.actualizaSwal.type = 'error';
      this.actualizaSwal.show();
    } else {
      let funcionarios = '';

      if (funcionarios.indexOf(funcionario) >= 0) {
        this.router.navigate([url_api, id_modelo], { queryParams: { func: funcionario } });
      } else {
        this.actualizaSwal.title = 'Sin autorización';
        this.actualizaSwal.html =
          'Lo sentimos, no tienes autorización para confirmar el inventario.';
        this.actualizaSwal.type = 'error';
        this.actualizaSwal.show();
      }
    }
  }

  CambiarEstadoDocumento(estado, documento) {
    let estadoNuevo;
    if (estado == 'Haciendo Primer Conteo') {
      estadoNuevo = 'Pendiente Primer Conteo';
    } else if (estado == 'Haciendo Segundo Conteo') {
      estadoNuevo = 'Primer Conteo';
    }

    let data = new FormData();
    data.append('estado', estadoNuevo);
    data.append('idDocumento', documento.Id_Doc_Inventario_Fisico_Punto);
    this.http
      .post(
        this.globales.ruta + 'php/inventariofisicopuntos/estiba/cambiar_estados_documentos.php',
        data,
      )
      .subscribe((res: any) => {
        if (res.tipo == 'success') {
          this.actualizaSwal.title = res.title;
          this.actualizaSwal.html = res.mensaje;
          this.actualizaSwal.type = res.tipo;
          this.actualizaSwal.show();
          documento.Estado = estadoNuevo;
        }
      });
  }
}

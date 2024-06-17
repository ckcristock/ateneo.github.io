import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Location, NgIf, NgFor, NgClass, CurrencyPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notas-carteras',
  templateUrl: './notas-carteras.component.html',
  styleUrls: ['./notas-carteras.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    CurrencyPipe,
  ],
})
export class NotasCarterasComponent implements OnInit {
  public NotasCarteras: any = [];
  public Cargando: boolean = true;
  public maxSize = 20;
  public TotalItems: number;
  public page = 1;
  public filtros: any = {
    codigo: '',
    fechas: '',
    tercero: '',
    estado: '',
  };
  public filtro_fecha: any = '';

  IdDocumento: string = '';
  // id_funcionario: any = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
  alertOption: SweetAlertOptions;
  perfilUsuario: any = localStorage.getItem('miPerfil');
  envirom: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private swalService: SwalService,
  ) {}

  ngOnInit() {
    this.ListarNotasCarteras();
    this.envirom = environment;
  }

  onCancelDoc() {
    const request = () => {
      this.anularDocumento();
    };
    this.swalService.swalLoading('Se dispone a anular este documento', request);
  }

  ListarNotasCarteras() {
    this.http
      .get(environment.ruta + 'php/contabilidad/notascarteras/lista_notas_carteras.php')
      .subscribe((data: any) => {
        this.Cargando = false;
        this.NotasCarteras = data.Notas;
        this.TotalItems = data.numReg;
      });
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.filtros.fechas = event.formatted;
    } else {
      this.filtros.fechas = '';
    }

    this.filtrar();
  }

  getStrConditions(pagination = false) {
    let params: any = {};

    if (this.filtros.codigo != '') {
      params.cod = this.filtros.codigo;
    }
    if (this.filtros.tercero != '') {
      params.tercero = this.filtros.tercero;
    }
    if (this.filtros.fechas != '') {
      params.fecha = this.filtros.fechas;
    }
    if (this.filtros.estado != '') {
      params.est = this.filtros.estado;
    }
    if (pagination) {
      params.pag = this.page;
    } else {
      this.page = 1;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/comprobante/notascartera', queryString);

    return queryString;
  }

  filtrar(pagination = false) {
    let queryString = this.getStrConditions(pagination);

    this.Cargando = true;

    this.http
      .get(
        environment.ruta + 'php/contabilidad/notascarteras/lista_notas_carteras.php?' + queryString,
      )
      .subscribe((data: any) => {
        this.Cargando = false;
        this.NotasCarteras = data.Notas;
        this.TotalItems = data.numReg;
      });
  }

  anularDocumento() {
    let datos: any = {
      Id_Registro: this.IdDocumento,
      Tipo: 'Notas_Cartera',
      // Identificacion_Funcionario: this.id_funcionario
    };

    this.AnularDocumentoContable(datos).subscribe(
      (data: any) => {
        let swal = {
          codigo: data.tipo,
          titulo: data.titulo,
          mensaje: data.mensaje,
        };
        this.swalService.ShowMessage(swal);

        this.ListarNotasCarteras();
      },
      (error) => {
        let swal = {
          codigo: 'warning',
          titulo: 'Oops!',
          mensaje:
            'Lamentablemente se ha perdido la conexión a internet. Por favor vuelve a intentarlo.',
        };
        this.swalService.ShowMessage(swal);
      },
    );
  }

  public AnularDocumentoContable(datos) {
    let info = JSON.stringify(datos);

    let data = new FormData();
    data.append('datos', info);

    return this.http.post(environment.ruta + 'php/contabilidad/anular_documento.php', data);
  }
}

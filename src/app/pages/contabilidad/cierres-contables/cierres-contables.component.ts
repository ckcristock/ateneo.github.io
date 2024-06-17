import { Component, OnInit, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { HttpClient } from '@angular/common/http';
import { CierrecontableService } from './cierrecontable.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ModalplancuentasComponent } from './modalplancuentas/modalplancuentas.component';
import { ModalcierrecontableComponent } from './modalcierrecontable/modalcierrecontable.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-cierres-contables',
  templateUrl: './cierres-contables.component.html',
  styleUrls: ['./cierres-contables.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgClass,
    NotDataComponent,
    ModalcierrecontableComponent,
    ModalplancuentasComponent,
    DatePipe,
  ],
})
export class CierresContablesComponent implements OnInit {
  public abrirPlanesCuenta: EventEmitter<string> = new EventEmitter();
  public modalCierre: Subject<any> = new Subject();
  public Cargando: boolean = true;
  envirom: any = {};
  public Cierres: any = {
    Mes: [],
    Anio: [],
  };

  constructor(
    private cierresContableService: CierrecontableService,
    private swalService: SwalService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.listaCierres();
    this.envirom = environment;
  }

  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros;
  }

  abrirModalCierre(tipo) {
    this.modalCierre.next(tipo);
  }

  nombreMes(mes) {
    let pos = parseInt(mes) - 1;
    return this.cierresContableService.getMes(pos);
  }

  listaCierres() {
    this.http
      .get(environment.base_url + '/php/contabilidad/cierres/lista_cierre.php')
      .subscribe((data: any) => {
        this.Cierres.Mes = data.Mes;
        this.Cierres.Anio = data.Anio;
        this.Cargando = false;
      });
  }

  anularCierreAnio(id) {
    this.swalService
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a anular el cierre de año, esta acción no se puede revertir',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          let p: any = { id: id };
          this.http
            .get(environment.base_url + '/php/contabilidad/cierres/anular_cierre.php', {
              params: p,
            })
            .subscribe((data: any) => {
              this.swalService.show({
                icon: data.codigo,
                title: data.titulo,
                text: data.mensaje,
                showCancel: false,
              });
              this.listaCierres();
            });
        }
      });
  }

  OnDestroy() {
    this.abrirPlanesCuenta.unsubscribe();
    this.modalCierre.unsubscribe();
  }
}

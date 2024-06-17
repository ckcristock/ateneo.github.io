import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { CierrecontableService } from '../cierrecontable.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PlanCuentasService } from '../../plan-cuentas/plan-cuentas.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/services/modal.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf, NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modalcierrecontable',
  templateUrl: './modalcierrecontable.component.html',
  styleUrls: ['./modalcierrecontable.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgIf,
    NgFor,
    MatInputModule,
    TextFieldModule,
  ],
})
export class ModalcierrecontableComponent implements OnInit, OnDestroy {
  @ViewChild('ModalCierreContable') ModalCierreContable: any;
  @Input() abrirModal: Observable<any> = new Observable();
  @Output() recargarListas: EventEmitter<any> = new EventEmitter();
  private _suscription: any;
  public modelCierre: any = {
    Id_Cierre_Contable: '',
    Mes: '',
    Anio: '',
    Tipo_Cierre: '',
    Observaciones: '',
    Id_Empresa: '',
  };
  public meses: any = [];
  public Anio: any = new Date().getFullYear();
  public alertOption: SweetAlertOptions = {};
  companies: any[] = [];
  constructor(
    private cierreContableService: CierrecontableService,
    private swalService: SwalService,
    private http: HttpClient,
    private _modal: ModalService,
  ) {}

  ngOnInit() {
    this._suscription = this.abrirModal.subscribe((data: any) => {
      this.modelCierre.Tipo_Cierre = data;
      this._modal.open(this.ModalCierreContable);
    });
    this.getMeses();
  }

  ngOnDestroy() {
    if (this._suscription != null && this._suscription != undefined) {
      this._suscription.unsubscribe();
    }
  }

  private guardarCierre(datos, tipo) {
    this.http
      .post(environment.base_url + '/php/contabilidad/cierres/guardar_cierre.php', datos)
      .subscribe((data: any) => {
        if (data.nroId) {
          this.openComprobantesCierreAnio(data.nroId, tipo);
        }
        this._modal.close();
        this.resetModel();
        this.swalService.show({
          icon: data.codigo,
          title: data.titulo,
          text: data.mensaje,
          showCancel: false,
        });
        this.recargarListas.emit();
      });
  }

  private openComprobantesCierreAnio(id, tipo) {}

  validarCierre() {
    Swal.fire({
      title: '¿Estás seguro(a)?',
      text: 'Vamos a guardar el proceso de cierre',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'question',
      input: 'select',
      inputOptions: {
        Pcga: 'Imprimir en PCGA',
        Niif: 'Imprimir en NIIF',
      },
      inputPlaceholder: 'Seleccione',
      confirmButtonColor: '#A3BD30',
      cancelButtonColor: '#d33',
      reverseButtons: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve('');
          } else {
            resolve('Necesitas seleccionar un tipo de moneda');
          }
        });
      },
    }).then((r) => {
      if (r.isConfirmed) {
        let info = this.cierreContableService.Utf8.encode(JSON.stringify(this.modelCierre));
        let datos = new FormData();
        datos.append('datos', info);

        this.http
          .post(environment.base_url + '/php/contabilidad/cierres/validar_cierre.php', datos)
          .subscribe((data: any) => {
            if (data.codigo == 'success') {
              this.guardarCierre(datos, r.value);
            } else {
              this.swalService.show({
                icon: data.codigo,
                text: data.mensaje,
                title: data.titulo,
                showCancel: false,
              });
            }
          });
      }
    });
  }

  private resetModel() {
    this.modelCierre = {
      Id_Cierre_Contable: '',
      Mes: '',
      Anio: '',
      Tipo_Cierre: '',
      Observaciones: '',
    };
  }

  getMeses() {
    this.meses = this.cierreContableService.getMeses();
  }
}

// ListasEmpresas() {
//   this._planCuentas.getCompanies().subscribe((data: any) => {
//     this.companies = data.data;
//   })
// }

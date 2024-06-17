import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PrestamoModel } from './PrestamoModel';
import { LoanService } from '../loan.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, FormsModule } from '@angular/forms';
import { consts } from 'src/app/core/utils/consts';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatInputModule } from '@angular/material/input';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteMdlComponent } from '../../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { InputPositionDirective } from '@app/core/directives/input-position.directive';
import { InputPositionInitialDirective } from '@app/core/directives/input-position-initial.directive';
import { Observable } from 'rxjs';
import { GlobalService } from '@shared/services/global.service';

@Component({
  selector: 'app-modalprestamoylibranzacrear',
  templateUrl: './modalprestamoylibranzacrear.component.html',
  styleUrls: ['./modalprestamoylibranzacrear.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    AutocompleteMdlComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgIf,
    MatInputModule,
    NgxCurrencyDirective,
    NgFor,
    TextFieldModule,
    InputPositionDirective,
    InputPositionInitialDirective,
    AsyncPipe,
  ],
})
export class ModalprestamoylibranzacrearComponent implements OnInit {
  @Output() recargarLista: EventEmitter<any> = new EventEmitter();

  masksMoney = consts;
  public Meses: any = [];
  people$ = new Observable();
  public modelo: PrestamoModel = new PrestamoModel();
  public cuotaDisabled: boolean = true;
  public inter: boolean = true;
  public Quincenas: any = [];
  public Bancos: any = [];
  public Comprobar: any = [];
  public PlanesCuenta: any = [];
  form: UntypedFormGroup;

  constructor(
    private _loan: LoanService,
    private modalService: NgbModal,
    private _swal: SwalService,
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private readonly globalService: GlobalService,
  ) {}

  ngOnInit() {
    this.people$ = this.globalService.getPeople$;
    this.createForm();
    this.getPlains();
    this.getProximasQuincenas();
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  createForm() {
    this.form = this.fb.group({});
  }

  getPlains() {
    this._loan.accountPlains().subscribe((r: any) => {
      this.PlanesCuenta = r.data.map((account) => ({
        text: account['code'],
        value: account['id'],
      }));
    });
  }

  ComprobarPrestamo(tipo) {
    if (this.modelo.person) {
      /* this.modelo.type = tipo; */
      if (tipo == 'Libranza') {
        /*   this._loan.getBankList().subscribe((r: any) => (this.Bancos = r.data)); */
      }
      let empleado = this.modelo.person;
      let Tipo = tipo;
      this.http
        .get(environment.base_url + '/php/prestamoylibranza/comprobar_prestamo.php', {
          params: { empleado: empleado, tipo: Tipo },
        })
        .subscribe((data: any) => {
          this.Comprobar = data;
          if (this.Comprobar.length > 0) {
            this.Comprobar.forEach((lista) => {
              if (lista.state == 'Pendiente') {
                this._swal.show({
                  icon: 'warning',
                  title: 'Funcionario con ' + lista.type.toLowerCase() + ' vigente',
                  text: 'El funcionario tiene un(a) ' + lista.type.toLowerCase() + ' activo(a)',
                  showCancel: false,
                });
                this.modelo.person = '';
                this.modelo.type = null;
              }
            });
          }
        });
    } else {
      this.modelo.type = '';
      this._swal.show({
        title: 'Selecciona un funcionario',
        icon: 'error',
        text: '',
        showCancel: false,
      });
    }
  }

  interesA(interes) {
    if (this.modelo.person.id) {
      this.modelo.interest_type = interes;
      if (interes == 'Capital') {
        /*   this._loan.getBankList().subscribe((r: any) => (this.Bancos = r.data)); */
      }
    } else {
      this._swal.show({
        title: 'Falta Seleccionar el funcionario',
        icon: 'error',
        text: 'Debe seleccionar un funcionario',
        showCancel: false,
      });
    }
  }

  getProximasQuincenas() {
    this._loan.getNextPayrolls().subscribe((r: any) => {
      this.Quincenas = r.data;
    });
  }
  save(form: NgForm) {
    if (form.valid) {
      this.modelo.person_id = this.modelo.person;
      // let info = JSON.stringify(this.modelo);
      const request = () => {
        this._loan.save(this.modelo).subscribe(
          (r: any) => {
            this._swal.show({
              title: 'Operación exitosa',
              text: 'Préstamo/Libranza creado con éxito',
              icon: 'success',
              showCancel: false,
              timer: 1000,
            });
            this.modalService.dismissAll();
            this.recargarLista.next('');
          },
          (err) => {
            this._swal.show({
              title: 'Ha ocurrido un error',
              text: 'Comuniquese con el departamento de sistemas',
              icon: 'error',
              showCancel: false,
            });
          },
        );
      };
      this._swal.swalLoading('', request);
    } else {
      this._swal.incompleteError();
    }
  }

  changePagoCuota(cuota) {
    if (cuota == 'Si') {
      this.cuotaDisabled = false;
      this.inter = false;
      if (typeof this.modelo.person == 'object') {
        let salario = parseFloat(this.modelo.person.Salario);
        let cuota = this.modelo.value / this.modelo.number_fees; // Agregando el 10% del salario del empleado como sugerencia para la cuota mensual.

        if (this.modelo.value < cuota) {
          this.modelo.monthly_fee = this.modelo.value;
        } else {
          this.modelo.monthly_fee = cuota;
        }
      }
    } else {
      this.cuotaDisabled = true;
      this.modelo.monthly_fee = this.modelo.value;
    }
  }
  CalduloCuota() {
    this.changePagoCuota(this.modelo.pay_fees);
  }
  SinInteres(value) {
    if (value == 'Sin') {
      this.modelo.interest = 0;
    }
  }
}

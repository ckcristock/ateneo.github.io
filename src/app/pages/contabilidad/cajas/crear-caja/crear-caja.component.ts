import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/services/person/person.service';
import { AccountPlanService } from 'src/app/core/services/account-plan.service';
import { PrettyCashService } from 'src/app/core/services/pretty-cash.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { CurrencyPipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
type Person = { value: number; text: string };
@Component({
  selector: 'app-crear-caja',
  templateUrl: './crear-caja.component.html',
  styleUrls: ['./crear-caja.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgSelectModule,
    CurrencyPipe,
  ],
})
export class CrearCajaComponent implements OnInit {
  @Input('openModal') openModal: EventEmitter<Boolean>;
  @Output('saved') saved = new EventEmitter<Boolean>();
  @ViewChild('modal') modal;
  @ViewChild('add') add;
  people: Person[] = [];
  accounts: any[] = [];
  forma: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _people: PersonService,
    private _prettyCash: PrettyCashService,
    private _account: AccountPlanService,
    private _swal: SwalService,
    private _reactiveValid: ValidatorsService,
    private _modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.getPeople();
    this.createForm();
    this.openModal.subscribe((r) => {
      this.getAccounts();
      this._modal.open(this.add, 'sm');
    });
  }

  getPeople() {
    this._people.getPersonCompany().subscribe((res: any) => {
      this.people = res.data;
    });
  }

  createForm() {
    this.forma = this.fb.group({
      person_id: [null, this._reactiveValid.required],
      account_plan_id: [null, this._reactiveValid.required],
      initial_balance: [null, this._reactiveValid.required],
      description: ['', this._reactiveValid.required],
    });
    this.forma.get('account_plan_id').valueChanges.subscribe((r) => {
      let account = this.accounts.find((x) => x.Id_Plan_Cuentas == r);
      this.forma.patchValue({
        initial_balance: account?.balance?.balance || 0,
      });
    });
  }

  getAccounts() {
    this._account.getAllWithBalance().subscribe((r: any) => {
      this.accounts = r.data;
    });
  }

  save() {
    if (this.forma.valid) {
      this._swal
        .show({
          icon: 'question',
          title: '¿Estás seguro(a)?',
          text: 'Vamos a crear una nueva caja',
        })
        .then((r) => {
          if (r.isConfirmed) {
            this._prettyCash.save(this.forma.value).subscribe(
              (r: any) => {
                this._swal.show({
                  title: 'Operación exitosa',
                  text: 'Se ha creado una nueva caja',
                  icon: 'success',
                  showCancel: false,
                  timer: 1000,
                });
                this.saved.emit(true);
                this.forma.reset();
                this._modal.close();
              },
              (er) => {
                this._swal.show({
                  title: 'Operación fallida ',
                  text: 'Ha ocurrido un error',
                  showCancel: false,
                  icon: 'error',
                });
              },
            );
          }
        });
    } else {
      this._swal.show({
        icon: 'error',
        title: 'Error',
        text: 'Completa la información.',
        showCancel: false,
        timer: 1000,
      });
    }
  }
}

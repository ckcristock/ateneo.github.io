import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { GlobalService } from '@shared/services/global.service';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { LONG_TEXT } from 'src/app/core/utils/consts';
import { MemorandosService } from '../../memorandos/memorandos.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-create-call-attention',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    AutocompleteFcComponent,
    AsyncPipe,
  ],
  templateUrl: './create-call-attention.component.html',
  styleUrls: ['./create-call-attention.component.scss'],
})
export class CreateCallAttentionComponent implements OnInit {
  people$ = new Observable();

  formLlamada!: FormGroup;

  call: any = {};

  numCall = 0;

  loadingCallAttention = false;

  nameUser = '';

  constructor(
    private memorandosService: MemorandosService,
    private readonly globalService: GlobalService,
    private fb: UntypedFormBuilder,
    private _reactiveValid: ValidatorsService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.people$ = this.globalService.getPeople$;
    this.createFormLLamada();
  }

  private createFormLLamada() {
    this.formLlamada = this.fb.group({
      reason: ['', [this._reactiveValid.required, Validators.maxLength(LONG_TEXT)]],
      number_call: ['', this._reactiveValid.required],
      person_id: ['', this._reactiveValid.required],
      user_id: [''],
    });
  }

  getCallAttentionForPerson(name: string): void {
    this.nameUser = name;
    this.loadingCallAttention = true;
    const numberCallcontrol = this.formLlamada.get('number_call');
    numberCallcontrol.setValue(null);
    const { value } = this.formLlamada.get('person_id');
    this.memorandosService.getCallAttentionForPerson(value).subscribe({
      next: (res) => {
        this.loadingCallAttention = false;
        this.numCall = res['data'];
        numberCallcontrol.setValue(this.numCall);
      },
    });
  }

  async createNewAttentionCall(): Promise<void> {
    try {
      await this._swal.confirm(`Crear llamado de atención para ${this.nameUser}`, {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.memorandosService.createNewAttentionCall(this.formLlamada.value).subscribe({
              next: (res: any) => {
                this.modalService.dismissAll('request-call-attention');
                this.formLlamada.reset();
                this._swal.show({
                  icon: 'success',
                  title: res.data,
                  showCancel: false,
                  text: '¡Llamado de atención creado con éxito!',
                  timer: 1000,
                });
                resolve(true);
              },
              error: () => {
                resolve(false);
              },
            });
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this._swal.hardError();
    }
  }
}

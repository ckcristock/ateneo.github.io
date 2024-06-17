import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { consts } from 'src/app/core/utils/consts';
import { SwalService } from '../../../../services/swal.service';
import { BonoService } from './bono.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { InputPositionDirective } from '../../../../../../../core/directives/input-position.directive';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, UpperCasePipe, DecimalPipe } from '@angular/common';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-bono',
  templateUrl: './bono.component.html',
  styleUrls: ['./bono.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    InputPositionDirective,
    NotDataComponent,
    UpperCasePipe,
    DecimalPipe,
    NgxCurrencyDirective,
  ],
})
export class BonoComponent implements OnInit {
  @Input() bonus: any[] = [];
  @Output() updateSuccess: EventEmitter<void> = new EventEmitter();
  bonusType: any[] = [];

  form: UntypedFormGroup;
  @ViewChild('modal') modal: any;
  @ViewChild('add') add: any;
  @Input('id') id: any;
  bonusTypes: any = consts.bonusType;
  loading: boolean;
  mask = consts;
  bonu: any = [
    {
      concept: '',
      value: '',
    },
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private bonusService: BonoService,
    private _swal: SwalService,
    private _modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.createFormBonus();
  }

  openModal() {
    this._modal.open(this.add);
    this.form.patchValue({
      countable_income_id: null,
      value: '',
      work_contract_id: this.id,
    });
  }

  createFormBonus() {
    this.form = this.fb.group({
      countable_income_id: [null, Validators.required],
      value: ['', Validators.required],
      work_contract_id: [this.id],
    });
  }

  anular(bonus, status) {
    let data: any = {
      id: bonus.id,
      status,
    };
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'El bono se inhabilitará',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.bonusService.addBonus(data).subscribe((res) => {
            this.updateSuccess.emit();
            this._swal.show({
              title: 'Bono inhabilitado',
              text: 'El bono ha sido inhabilitado con éxito',
              icon: 'success',
              showCancel: false,
              timer: 1000,
            });
          });
        }
      });
  }

  getBonusList(bonusType) {
    this.bonusService.getBonusList({ bonusType }).subscribe((res: any) => {
      this.bonusType = res.data;
    });
  }

  addBonus() {
    const request = () => {
      this.form.markAllAsTouched();
      if (this.form.invalid) {
        return false;
      }
      this.bonusService.addBonus(this.form.value).subscribe((res) => {
        this._modal.close();
        this.updateSuccess.emit();
        this._swal.show({
          title: 'Creado con éxito',
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false,
        });
      });
    };
    this._swal.swalLoading('', request);
  }
  get bonus_type_valid() {
    return (
      this.form.get('countable_income_id').invalid && this.form.get('countable_income_id').touched
    );
  }

  get value_valid() {
    return this.form.get('value').invalid && this.form.get('value').touched;
  }
}

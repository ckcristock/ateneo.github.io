import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DisabilityLeavesService } from '../disability-leaves.service';
import { PayrollFactorService } from '../payroll-factor.service';
import moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { GlobalService } from '@shared/services/global.service';
import { Observable } from 'rxjs';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteFcComponent } from '../../../../components/autocomplete-fc/autocomplete-fc.component';
import { MultiFilesComponent } from '@shared/components/multi-files/multi-files.component';
import { LoadFile } from '@shared/functions/load-file';
import { NgxCurrencyDirective } from 'ngx-currency';
import { InputPositionInitialDirective } from '@app/core/directives/input-position-initial.directive';
import { consts } from '@app/core/utils/consts';

@Component({
  selector: 'app-crear-novedad',
  templateUrl: './crear-novedad.component.html',
  styleUrls: ['./crear-novedad.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AutocompleteFcComponent,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    TextFieldModule,
    AsyncPipe,
    MultiFilesComponent,
    NgxCurrencyDirective,
    InputPositionInitialDirective,
  ],
})
export class CrearNovedadComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @Input('open') open: EventEmitter<any>;
  @Output('saving') saving = new EventEmitter();
  form: UntypedFormGroup;
  people$ = new Observable();
  disabilityLeaves: any[];
  maskNumbers = consts.maskNumbers;
  vacationSelected: boolean;
  currentFiles = [];
  constructor(
    private fb: UntypedFormBuilder,
    private _disabilityLeaves: DisabilityLeavesService,
    private _payrollFactor: PayrollFactorService,
    private modalService: NgbModal,
    private _swal: SwalService,
    private readonly globalService: GlobalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getDisabilityLeaves();
    this.people$ = this.globalService.getPeople$;
    this.open.subscribe((r) => {
      this.currentFiles = [];
      if (r?.data) {
        this.currentFiles = r.data.documents.map((file) => {
          file.notDelete = true;
          return file;
        });
      }

      if (r?.data) {
        this.form.patchValue({
          id: r.data.id,
          person_id: r.data.person_id,
          disability_leave_id: r.data.disability_leave_id,
          disability_type: r.data.disability_type,
          date_start: moment.utc(r.data.date_start).format('YYYY-MM-DD'),
          date_end: moment.utc(r.data.date_end).format('YYYY-MM-DD'),
          modality: r.data.modality,
          number_days: r.data.number_days,
          observation: r.data.observation,
          payback_date: r.data.payback_date,
        });
      } else {
        this.createForm();
      }
      this.openConfirm(this.modal);
    });
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  private getDismissReason(reason: any) {}

  getDisabilityLeaves() {
    this._disabilityLeaves.getDisabilityLeaves().subscribe((r: any) => {
      this.disabilityLeaves = r.data;
    });
  }

  obtenerTipoNovedad(value) {
    let tipo = value.split(' ')[0];
    tipo == 'Vacaciones' ? (this.vacationSelected = true) : (this.vacationSelected = false);
    this.form.patchValue({ disability_type: tipo });
  }

  onNewFiles(files: LoadFile[]) {
    this.form.get('files').setValue(files);
  }

  sendData() {
    const request = () => {
      this.form.get('disability_type').enable();
      this._payrollFactor.savePayrollFactor(this.form.getRawValue()).subscribe((r: any) => {
        if (r.code == 200) {
          this._swal.show({
            icon: 'success',
            title: 'Operación exitosa',
            showCancel: false,
            text: 'Se han actualizado las novedades',
            timer: 1000,
          });
          this.createForm();
          this.saving.next('');
          this.modalService.dismissAll();
          //this.modal.hide();
        } else {
          this._swal.show({
            icon: 'error',
            title: 'Operación denegada',
            showCancel: false,
            text: r.err,
          });
        }
      });
    };
    this._swal.swalLoading('', request);
  }
  createForm() {
    this.form = this.fb.group({
      id: [''],
      person_id: [null, Validators.required],
      disability_leave_id: [null, Validators.required],
      disability_type: [{ value: '', disabled: true }, Validators.required],
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      modality: ['Día', Validators.required],
      observation: ['', Validators.required],
      payback_date: ['', Validators.required],
      number_days: ['', Validators.required],
      files: [''],
    });
    this.form.get('number_days').valueChanges.subscribe((r) => {
      const date_start = this.form.get('date_start');
      if (date_start.value) {
        const date_end = this.form.get('date_end');
        const payback_date = this.form.get('payback_date');
        const finalDate = moment(date_start.value)
          .add(r - 1, 'days')
          .format('YYYY-MM-DD');

        date_end.patchValue(finalDate);
        payback_date.patchValue(finalDate);
      }
    });
  }
  get person_id_invalid() {
    return this.form.get('person_id').invalid && this.form.get('person_id').touched;
  }
  get disability_leave_id_invalid() {
    return (
      this.form.get('disability_leave_id').invalid && this.form.get('disability_leave_id').touched
    );
  }
  get date_start_invalid() {
    return this.form.get('date_start').invalid && this.form.get('date_start').touched;
  }
  get date_end_invalid() {
    return this.form.get('date_end').invalid && this.form.get('date_end').touched;
  }
  get observation_invalid() {
    return this.form.get('observation').invalid && this.form.get('observation').touched;
  }
  get number_days_invalid() {
    return this.form.get('number_days').invalid && this.form.get('number_days').touched;
  }
}

import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ValidatorsService } from '../../../../ajustes/informacion-base/services/reactive-validation/validators.service';
import { RotatingTurnService } from '../../../../ajustes/informacion-base/turnos/turno-rotativo/rotating-turn.service';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { ExtraHoursService } from '../../extra-hours.service';
import { ModalBasicComponent } from '../../../../../components/modal-basic/modal-basic.component';

@Component({
  selector: 'app-edit-diario-fixed',
  templateUrl: './edit-diario-fixed.component.html',
  styleUrls: ['./edit-diario-fixed.component.scss'],
  standalone: true,
  imports: [ModalBasicComponent, FormsModule, ReactiveFormsModule],
})
export class EditDiarioFixedComponent implements OnInit {
  @Input('diario') diario: any;
  @ViewChild('modal') modal: any;
  @Input('openModal') openModal: EventEmitter<any>;
  @Output('saved') saved = new EventEmitter<any>();
  forma: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private _valReactive: ValidatorsService,
    private _swal: SwalService,
    private _extra: ExtraHoursService,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    let data = this.makeData();
    this.forma = this.fb.group({
      entry_time_one: [data.entry_time_one, this._valReactive.required],
      leave_time_one: [data.leave_time_one, this._valReactive.required],
      entry_time_two: [data.entry_time_two, this._valReactive.required],
      leave_time_two: [data.leave_time_two, this._valReactive.required],
    });
  }

  makeData() {
    return {
      entry_time_one: this.diario?.entry_time_one ? this.diario?.entry_time_one : '',
      leave_time_one: this.diario?.leave_time_one ? this.diario?.leave_time_one : '',
      entry_time_two: this.diario?.entry_time_two ? this.diario?.entry_time_two : '',
      leave_time_two: this.diario?.leave_time_two ? this.diario?.leave_time_two : '',
    };
  }

  update() {
    this._extra.updateFixedTurnDiary(this.diario.id, this.forma.value).subscribe((r) => {});
    this.modal.hide();
    this.saved.emit();
  }

  show() {
    this.modal.show();
  }

  get hasBreck() {
    return this.diario?.turnoOficial?.breack == 1;
  }
  get hasLaunch() {
    return this.diario?.turnoOficial?.launch == 1;
  }
}

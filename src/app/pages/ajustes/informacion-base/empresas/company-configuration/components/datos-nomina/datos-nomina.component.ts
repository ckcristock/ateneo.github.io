import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DecimalPipe } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ConfiguracionEmpresaService } from '../../configuracion-empresa.service';
import { SwalService } from '../../../../services/swal.service';

@Component({
  selector: 'app-datos-nomina',
  templateUrl: './datos-nomina.component.html',
  styleUrls: ['./datos-nomina.component.scss'],
  standalone: true,
  imports: [
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DecimalPipe,
  ],
})
export class DatosNominaComponent implements OnInit, DoCheck {
  @Output() update = new EventEmitter();
  @Input('data') set changeData(newData) {
    if (newData) {
      this.nomina = newData;
      this.getNominaData();
    }
  }
  form: UntypedFormGroup;
  nomina: any = [];
  loading: boolean = true;
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: UntypedFormBuilder,
    private _modal: ModalService,
    private _swal: SwalService,
  ) {}
  ngDoCheck(): void {
    if (this.nomina.id) {
      this.loading = false;
    }
  }

  updateData() {
    this.update.emit();
  }

  ngOnInit(): void {
    this.getNominaData();
  }

  openModal(modal) {
    this._modal.open(modal);
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.nomina.id],
      max_extras_hours: ['', Validators.required],
      max_holidays_legal: ['', Validators.required],
      max_late_arrival: ['', Validators.required],
      base_salary: ['', Validators.required],
      transportation_assistance: ['', Validators.required],
      night_start_time: ['', Validators.required],
      night_end_time: ['', Validators.required],
    });
  }

  getNominaData() {
    this.createForm();
    this.form.patchValue({
      id: this.nomina.id,
      max_extras_hours: this.nomina.max_extras_hours,
      max_holidays_legal: this.nomina.max_holidays_legal,
      max_late_arrival: this.nomina.max_late_arrival,
      base_salary: this.nomina.base_salary,
      transportation_assistance: this.nomina.transportation_assistance,
      night_start_time: this.nomina.night_start_time,
      night_end_time: this.nomina.night_end_time,
    });
  }

  saveNominaData() {
    const request = () => {
      this._configuracionEmpresaService.saveCompanyData(this.form.value).subscribe((res: any) => {
        this._modal.close();
        this.updateData();
        this.getNominaData();
        this._swal.show({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Datos actualizados correctamente',
          timer: 1000,
          showCancel: false,
        });
      });
    };
    this._swal.swalLoading('', request);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgForm, FormsModule } from '@angular/forms';
import { DeductionService } from 'src/app/core/services/deductions.service';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

const TYPE_INCOME: string = 'Constitutivo';

@Component({
  selector: 'app-deducciones',
  templateUrl: './deducciones.component.html',
  styleUrls: ['./deducciones.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    NotDataComponent,
    CurrencyPipe,
  ],
})
export class DeduccionesComponent implements OnInit {
  @Input('person') person;
  @Input('periodo') periodo;
  @Input('nominaPaga') nominaPaga = false;
  @Output('updated') updated = new EventEmitter();

  loading = false;
  private;

  deducciones: any[] = [];
  countDeducciones: any[] = [];
  constructor(
    private _deduction: DeductionService,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.getCountDeducciones();
  }

  save(form: NgForm) {
    this._swal
      .show({
        title: '¿Está seguro?',
        text: 'Se dispone a guardar una deducción',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._deduction.saveDeduction(form.value).subscribe((r) => {
            this._swal.show({
              title: 'Guardado con éxito',
              text: 'Se ha guardado una deducción',
              icon: 'success',
              showCancel: false,
            });
            this.getDatosDeducciones();
            this.update();
          });
        }
      });
  }
  delete(id) {
    this._swal
      .show({
        title: '¿Está seguro?',
        text: 'Se dispone a eliminar una deducción',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._deduction.deleteDeduction(id).subscribe((r) => {
            this._swal.show({
              title: 'Eliminado con éxito',
              text: 'Se ha eliminado una deducción',
              icon: 'success',
              showCancel: false,
            });
            this.getDatosDeducciones();
            this.update();
          });
        }
      });
  }

  getCountDeducciones() {
    this._deduction.getCountableDeductions().subscribe((r: any) => {
      this.countDeducciones = r.data;
      this.getDatosDeducciones();
    });
  }
  getDatosDeducciones() {
    this.loading = true;
    this._deduction.getDeductions(this.person.id).subscribe((r: any) => {
      this.deducciones = r.data;
      this.loading = false;
    });
  }

  update() {
    this.updated.emit();
  }
}

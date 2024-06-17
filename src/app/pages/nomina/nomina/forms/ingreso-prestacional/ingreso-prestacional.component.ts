import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CountableIncomesService } from '../../../../../core/services/countable-incomes.service';
import { NgForm, FormsModule } from '@angular/forms';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

const TYPE_INCOME: string = 'Constitutivo';

@Component({
  selector: 'app-ingreso-prestacional',
  templateUrl: './ingreso-prestacional.component.html',
  styleUrls: ['./ingreso-prestacional.component.scss'],
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
export class IngresoPrestacionalComponent implements OnInit {
  @Input('person') person;
  @Input('periodo') periodo;
  @Input('nominaPaga') nominaPaga = false;
  @Output('updated') updated = new EventEmitter();

  loading = false;
  private;

  ingresos: any[] = [];
  ingresosPDatos: any[] = [];
  constructor(
    private _countableIncomes: CountableIncomesService,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.getIngresosPrestacionales();
  }

  save(form: NgForm) {
    this._swal
      .show({
        title: '¿Está seguro?',
        text: 'Se dispone a guardar un ingreso prestacional',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._countableIncomes.saveBenefitIncome(form.value).subscribe((r) => {
            this._swal.show({
              title: 'Guardado con éxito',
              text: 'Se ha guardado un ingreso prestacional',
              icon: 'success',
              showCancel: false,
            });
            this.getDatosIngresosP();
            this.update();
          });
        }
      });
  }
  delete(id) {
    this._swal
      .show({
        title: '¿Está seguro?',
        text: 'Se dispone a eliminar un ingreso prestacional',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._countableIncomes.deleteBenefitIncome(id).subscribe((r) => {
            this._swal.show({
              title: 'Eliminado con éxito',
              text: 'Se ha eliminado un ingreso prestacional',
              icon: 'success',
              showCancel: false,
            });
            this.getDatosIngresosP();
            this.update();
          });
        }
      });
  }

  getIngresosPrestacionales() {
    this._countableIncomes.getCountableIncomes({ type: TYPE_INCOME }).subscribe((r: any) => {
      this.ingresosPDatos = r.data;
      this.getDatosIngresosP();
    });
  }
  getDatosIngresosP() {
    this.loading = true;
    this._countableIncomes.getBenefitIncome(this.person.id).subscribe((r: any) => {
      this.ingresos = r.data;
      this.loading = false;
    });
  }

  update() {
    this.updated.emit();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CountableIncomesService } from 'src/app/core/services/countable-incomes.service';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

const TYPE_INCOME: string = 'No Constitutivo';

@Component({
  selector: 'app-ingreso-no-prestacional',
  templateUrl: './ingreso-no-prestacional.component.html',
  styleUrls: ['./ingreso-no-prestacional.component.scss'],
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
export class IngresoNoPrestacionalComponent implements OnInit {
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
    this.getIngresosNoPrestacionales();
  }

  save(form: NgForm) {
    this._swal
      .show({
        title: '¿Está seguro?',
        text: 'Se dispone a guardar un ingreso NO prestacional',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._countableIncomes.saveBenefitNotIncome(form.value).subscribe((r) => {
            this._swal.show({
              title: 'Guardado con éxito',
              text: 'Se ha guardado un ingreso no prestacional',
              icon: 'success',
              showCancel: false,
            });
            this.getDatosIngresosNP();
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
          this._countableIncomes.deleteBenefitNotIncome(id).subscribe((r) => {
            this._swal.show({
              title: 'Eliminado con éxito',
              text: 'Se ha eliminado un ingreso prestacional',
              icon: 'success',
              showCancel: false,
            });
            this.getDatosIngresosNP();
            this.update();
          });
        }
      });
  }

  getIngresosNoPrestacionales() {
    this._countableIncomes.getCountableIncomes({ type: TYPE_INCOME }).subscribe((r: any) => {
      this.ingresosPDatos = r.data;
      this.getDatosIngresosNP();
    });
  }
  getDatosIngresosNP() {
    this.loading = true;
    this._countableIncomes.getBenefitNotIncome(this.person.id).subscribe((r: any) => {
      this.ingresos = r.data;
      this.loading = false;
    });
  }

  update() {
    this.updated.emit();
  }
}

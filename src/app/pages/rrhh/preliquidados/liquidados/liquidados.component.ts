import { CurrencyPipe, NgIf, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { LiquidadosService } from './liquidados.service';
import { consts } from 'src/app/core/utils/consts';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { InputPositionDirective } from '@app/core/directives/input-position.directive';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';

@Component({
  selector: 'app-liquidados',
  templateUrl: './liquidados.component.html',
  styleUrls: ['./liquidados.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    NgxCurrencyDirective,
    InputPositionDirective,
    TextFieldModule,
    NotDataComponent,
    DecimalPipe,
    TitleCasePipe,
  ],
})
export class LiquidadosComponent implements OnInit {
  mask = consts;

  public datosCabecera: any = {
    Titulo: 'Liquidación del funcionario',
    Fecha: new Date(),
  };
  id: any;
  diasTrabajados: any;
  liquidado: any = [];
  info: any = [];
  date = new Date().toISOString().split('T')[0];
  loading: boolean = false;
  classList =
    'list-group-item d-flex list-group-item-action justify-content-between align-items-center';
  form: UntypedFormGroup;
  indemnizacion: boolean;

  valorDiasTrabajados: any[] = [];

  totalLiquidacion: number = 0;
  total: number = 0;
  salarioPendiente: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private liquidadosService: LiquidadosService,
    private _swal: SwalService,
    private fb: UntypedFormBuilder,
    private currencyPipe: CurrencyPipe,
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.diasTrabajados = this.activatedRoute.snapshot.params.value;
    this.getLiquidado();
    this.createForm();
  }

  liquidar() {
    if (this.form.invalid) {
      this._swal.incompleteError();
      return;
    }
    const data = this.form.value;
    const request = () => {
      this.liquidadosService.liquidar(data).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.router.navigate(['/rrhh/liquidados']);
            this._swal.success(response.data);
          } else {
            this._swal.hardError();
          }
        },
        error: () => {
          this._swal.hardError();
        },
      });
    };
    this._swal.swalLoading('Vamos a liquidar al funcionario', request);
  }

  createForm() {
    this.form = this.fb.group({
      person_id: [this.id, Validators.required],
      motivo: ['', Validators.required],
      justa_causa: ['', Validators.required],
      fecha_contratacion: ['', Validators.required],
      fecha_terminacion: ['', Validators.required],
      dias_liquidados: ['', Validators.required],
      dias_vacaciones: ['', Validators.required],
      /* vacacionesacumuladas: ['', Validators.required], */
      salario_base: ['', Validators.required],
      vacaciones_base: ['', Validators.required],
      cesantias_base: ['', Validators.required],
      dominicales_incluidas: ['', Validators.required],
      cesantias_anterior: ['', Validators.required],
      intereses_cesantias: ['', Validators.required],
      otros_ingresos: ['', Validators.required],
      prestamos: ['', Validators.required],
      otras_deducciones: ['', Validators.required], //ya verás como solucionas
      notas: ['', Validators.required],
      ingresos_adicionales: [0],
      deducciones_adicionales: [0],
      valor_dias_vacaciones: ['', Validators.required],
      valor_cesantias: ['', Validators.required],
      valor_prima: ['', Validators.required],
      sueldo_pendiente: [''],
      auxilio_pendiente: [''],
      otros: [''],
      salud: [''],
      pension: [''],
      total: [''],
    });
  }

  getLiquidado() {
    this.loading = true;
    this.liquidadosService.getLiquidado(this.id).subscribe(async (res: any) => {
      this.liquidado = res.data;
      let fechaFin = this.liquidado.work_contract.date_end
        ? this.liquidado.work_contract.date_end
        : this.date;
      this.form.patchValue({
        fecha_terminacion: fechaFin,
      });
      await this.changeParams(fechaFin);
      if (this.diasTrabajados == 'si') {
        await this.getDiasTrabajados(fechaFin);
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  async changeParams(fechaFin) {
    await this.liquidadosService
      .mostrar(this.id, fechaFin)
      .toPromise()
      .then((res: any) => {
        this.info = res;
        this.totalLiquidacion = this.info.total_liquidacion;

        this.form.get('ingresos_adicionales').valueChanges.subscribe((value) => {
          this.calcularTotalLiquidacion();
          // this.form.patchValue({
          //   total: this.form.get('total').value + value
          //})
        });

        this.form.get('deducciones_adicionales').valueChanges.subscribe((value) => {
          this.calcularTotalLiquidacion();
        });

        this.form.patchValue({
          fecha_contratacion: res.fecha_ingreso,
          dias_vacaciones: res.vacaciones_actuales,
          vacaciones_base: res.base_vacaciones,
          cesantias_base: res.base_cesantias,
          dias_liquidados: res.dias_liquidacion,
          salario_base: res.salario,
          fecha_terminacion: res.fecha_retiro,
          prestamos: res.prestamos,
          otros_ingresos: res.total_ingresos ?? 0,
          otras_deducciones: res.total_egresos,
          valor_cesantias: res.total_cesantias,
          valor_prima: res.total_prima,
          cesantias_anterior: res.cesantias_anterior ?? 0,
          intereses_cesantias: res.intereses_cesantias ?? 0,
          valor_dias_vacaciones: res.valor_dias_vacaciones ?? 0,
        });
      });
  }

  async getDiasTrabajados(fechaFin) {
    await this.liquidadosService
      .getDiasTrabajados(this.id, fechaFin)
      .toPromise()
      .then((res: any) => {
        if (res.data) {
          this.valorDiasTrabajados = res.data;

          this.salarioPendiente = res.data.salario_neto;
          this.total = this.salarioPendiente + this.totalLiquidacion;

          this.form.patchValue({
            sueldo_pendiente: res.data.salario_neto,
            salud: res.data.seguridad_social,
            total: this.total,
          });
        }
      });
  }

  calcularTotalLiquidacion() {
    let IngresosAdicionales = this.form.get('ingresos_adicionales').value || 0;
    let DeduccionesAdicionales = this.form.get('deducciones_adicionales').value || 0;
    this.totalLiquidacion =
      this.info.total_liquidacion + IngresosAdicionales - DeduccionesAdicionales;
    this.total = this.totalLiquidacion + this.salarioPendiente;
  }

  justaCausaValidate(event) {
    if (event.value == 'si') {
      this.indemnizacion = false;

      this.total = this.totalLiquidacion + this.salarioPendiente;
    } else if (event.value == 'no') {
      this.indemnizacion = true;
      this.total = this.info.total_indemnizacion + this.totalLiquidacion + this.salarioPendiente;
    }
  }

  cancelButton() {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: 'Se cancelará la liquidación.',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/rrhh/liquidados']);
        }
      });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { PayRollProvisionsService } from './pay-roll-privisions.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { DiasVacacionesComponent } from './dias-vacaciones/dias-vacaciones.component';
import { BaseCalculoComponent } from './base-calculo/base-calculo.component';
import { ResumenProvisionesComponent } from './resumen-provisiones/resumen-provisiones.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-provisiones',
  templateUrl: './provisiones.component.html',
  styleUrls: ['./provisiones.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ResumenProvisionesComponent,
    BaseCalculoComponent,
    DiasVacacionesComponent,
    NotDataComponent,
  ],
})
export class ProvisionesComponent implements OnInit {
  @Input('funcionarioProp') funcionarioProp;
  @Input('datosEmpresaProp') datosEmpresaProp;
  @Input('fechaInicio') fechaInicio;
  @Input('fechaFin') fechaFin;

  funcionario: any = {};
  datosEmpresa: any = {};
  mostrarCalculo = false;
  provisionesDatos: any;

  constructor(private _payrollProv: PayRollProvisionsService) {}

  ngOnInit(): void {
    this.funcionario = this.funcionarioProp;
    this.datosEmpresa = this.datosEmpresaProp;
    this.getProvisionesDatos();
  }

  getProvisionesDatos() {
    this._payrollProv
      .getProvisions({
        pid: this.funcionario.id,
        inicio: this.fechaInicio,
        fin: this.fechaFin,
      })
      .subscribe((r) => {
        this.provisionesDatos = r;
        this.mostrarCalculo = true;
      });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { PayRollDetailService } from '../colilla-pago/pay-roll-detail.service';
import { PayRollSocialSecurityService } from './pay-roll-social-security.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { IbcParafiscalesComponent } from './components/ibc-parafiscales/ibc-parafiscales.component';
import { IbcRiesgosComponent } from './components/ibc-riesgos/ibc-riesgos.component';
import { IbcSaludPensionComponent } from './components/ibc-salud-pension/ibc-salud-pension.component';
import { SeguridadSocialResumenComponent } from './components/seguridad-social-resumen/seguridad-social-resumen.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-seguridad-parafiscales',
  templateUrl: './seguridad-parafiscales.component.html',
  styleUrls: ['./seguridad-parafiscales.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    SeguridadSocialResumenComponent,
    IbcSaludPensionComponent,
    IbcRiesgosComponent,
    IbcParafiscalesComponent,
    NotDataComponent,
  ],
})
export class SeguridadParafiscalesComponent implements OnInit {
  @Input('funcionarioProp') funcionarioProp;
  @Input('datosEmpresaProp') datosEmpresaProp;
  @Input('fechaInicio') fechaInicio;
  @Input('fechaFin') fechaFin;

  funcionario: any = {};
  datosEmpresa: any = {};
  mostrarCalculo = false;
  retencionesDatos: any = {};
  seguridadDatos: any = {};
  porcentajesDatos: any = {};

  constructor(
    private _payRolSocial: PayRollSocialSecurityService,
    private _payRollDetail: PayRollDetailService,
  ) {}

  ngOnInit(): void {
    this.datosEmpresa = this.datosEmpresaProp;
    this.funcionario = this.funcionarioProp;
    this.getRetencionesDatos();
    this.getSeguridadDatos();
    this.getPorcentajesDatos();
    setTimeout(() => {
      this.mostrarCalculo = true;
    }, 1500);
  }

  getRetencionesDatos() {
    this._payRollDetail
      .getRetentions({
        pid: this.funcionario.id,
        inicio: this.fechaFin,
        fin: this.fechaInicio,
      })
      .subscribe((r) => {
        this.retencionesDatos = r;
      });
  }

  getSeguridadDatos() {
    this._payRolSocial
      .getScurity({
        pid: this.funcionario.id,
        inicio: this.fechaInicio,
        fin: this.fechaFin,
      })
      .subscribe((r) => {
        this.seguridadDatos = r;
      });
  }

  async getPorcentajesDatos() {
    this._payRolSocial
      .getScurityPercentages({
        pid: this.funcionario.id,
      })
      .subscribe((r) => {
        this.porcentajesDatos = r;
      });
  }
}

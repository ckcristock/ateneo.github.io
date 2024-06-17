import { Component, OnInit } from '@angular/core';
import { PayrollPersonService } from './payroll-person.service';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ImagePipe } from '../../../../core/pipes/image.pipe';
import { ProvisionesComponent } from './provisiones/provisiones.component';
import { SeguridadParafiscalesComponent } from './seguridad-parafiscales/seguridad-parafiscales.component';
import { ColillaPagoComponent } from './colilla-pago/colilla-pago.component';
import {
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-nomina-funcionario',
  templateUrl: './nomina-funcionario.component.html',
  styleUrls: ['./nomina-funcionario.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgbNav,
    NgFor,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    ColillaPagoComponent,
    SeguridadParafiscalesComponent,
    ProvisionesComponent,
    NgbNavOutlet,
    ImagePipe,
  ],
})
export class NominaFuncionarioComponent implements OnInit {
  active = 1;
  tabs = ['Colilla Pago', 'Seguridad y Parafiscales', 'Provisiones'];
  tabActual = 'Colilla Pago';
  funcionario: any = {};
  datosEmpresa: any = {};
  pid = '';
  inicio = '';
  fin = '';
  show = false;

  constructor(
    private _payPerson: PayrollPersonService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.pid = this.route.snapshot.params.pid;
    this.inicio = this.route.snapshot.params.fin;
    this.fin = this.route.snapshot.params.inicio;
    this.getUsuario();
    this.cargarDatosEmpresa();
  }

  getUsuario() {
    this._payPerson.getPersonPay({ pid: this.pid }).subscribe((r: any) => {
      this.funcionario = r;
    });
  }
  async cargarDatosEmpresa() {
    await this._payPerson
      .getCompanyGlobal()
      .toPromise()
      .then((r: any) => {
        this.datosEmpresa = r;
        this.show = true;
      });
  }
  get inicioFormato() {
    return moment(this.inicio).format('DD/MM/YYYY');
  }
  get finFormato() {
    return moment(this.fin).format('DD/MM/YYYY');
  }
}

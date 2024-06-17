import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { ComprasPendientesComponent } from './components/compras-pendientes/compras-pendientes.component';
import { ActasPendientesComponent } from './components/actas-pendientes/actas-pendientes.component';
import { ActasAnuladasComponent } from './components/actas-anuladas/actas-anuladas.component';
import { ActasIngresadasComponent } from './components/actas-ingresadas/actas-ingresadas.component';

@Component({
  selector: 'app-acta-recepcion',
  templateUrl: './acta-recepcion.component.html',
  styleUrls: ['./acta-recepcion.component.scss'],
  standalone: true,
  imports: [
    ComprasPendientesComponent,
    ActasPendientesComponent,
    ActasAnuladasComponent,
    ActasIngresadasComponent,
  ],
})
export class ActaRecepcionComponent {
  companyWorkedId: any;
  constructor(private _user: UserService) {
    this.companyWorkedId = this._user.user.person.company_worked.id;
  }
}

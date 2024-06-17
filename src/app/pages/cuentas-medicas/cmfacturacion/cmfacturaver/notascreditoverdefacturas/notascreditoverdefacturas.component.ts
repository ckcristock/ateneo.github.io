import { Component, OnInit, ViewChild, Input } from '@angular/core';

// import 'rxjs/add/operator/takeWhile';

import { HttpClient } from '@angular/common/http';

import { ActivatedRoute, RouterModule } from '@angular/router';
// import { Globales } from '../shared/globales/globales';
import { Globales } from 'src/app/pages/inventario/services/globales-datos';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgbDropdownModule,
  ],
  providers: [RouterModule],
  selector: 'app-notascreditoverdefacturas',
  templateUrl: './notascreditoverdefacturas.component.html',
  styleUrls: ['./notascreditoverdefacturas.component.scss'],
})
export class NotascreditoverdefacturasComponent implements OnInit {
  public idNotaCredito = this.route.snapshot.params['id'];
  public Notas: any = {
    Productos_Nota: '',
  };
  public Lista_Productos: any[] = [];
  public Cliente: any[] = [];
  public Factura: any[] = [];
  public Total: any;
  public user: any;

  public perfilUsuario = localStorage.getItem('miPerfil');
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @Input() idFactura: any;
  @Input() tipoFactura: any;

  public reducer = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Valor_Nota_Credito);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public globales: Globales,
    private router: Router,
    private _user: UserService,
  ) {}

  ngOnInit() {
    this.user = this._user.user;
    this.http
      .get(environment.ruta + 'php/notas_credito_nuevo/get_nota_credito_por_factura.php', {
        params: { id_factura: this.idFactura, tipo_factura: this.tipoFactura },
      })
      .subscribe((data: any) => {
        this.Notas = data.Notas;
        this.Factura = data.Factura;
        this.Cliente = data.Cliente;

        this.Notas.forEach((nota: Array<any>) => {
          nota['Total'] = nota['Productos_Nota'].reduce(this.reducer, 0);
        });
      });
  }
}

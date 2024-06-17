import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../globales';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-notascreditover',
  templateUrl: './notascreditover.component.html',
  styleUrls: ['./notascreditover.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink, CurrencyPipe, DatePipe, TableComponent],
})
export class NotascreditoverComponent implements OnInit {
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  enviromen: any;
  public idNotaCredito = this.route.snapshot.params['id'];
  public Datos: any = {
    Factura: '',
    Cliente: '',
  };
  public Lista_Productos: any[] = [];
  public Total: any;
  public TotalImpuesto: any;
  public user: any;
  public DatosCabecera: any = {
    Titulo: 'Nota Crédito',
    Fecha: new Date(null),
    Codigo: '',
  };
  public Cargando: boolean = false;
  public perfilUsuario = localStorage.getItem('miPerfil');

  public reducer = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Valor_Nota_Credito);
  public reducerImpuesto = (accumulador, currentValue) =>
    accumulador + parseFloat(currentValue.Total_Impuesto);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public globales: Globales,
    private router: Router,
    private _user: UserService,
  ) {}

  ngOnInit() {
    this.user = this._user.user;
    this.enviromen = environment;
    this.Cargando = true;
    this.http
      .get(environment.base_url + '/php/notas_credito_nuevo/get_nota_credito.php', {
        params: { id_nota_credito: this.idNotaCredito },
      })
      .subscribe((data: any) => {
        this.Datos = data.Nota_Credito;
        this.Lista_Productos = data.Productos_Nota;
        console.log('datadatadata', data);

        this.Total = this.Lista_Productos.reduce(this.reducer, 0);
        this.TotalImpuesto = this.Lista_Productos.reduce(this.reducerImpuesto, 0);
        this.Cargando = false;
      });
  }
}

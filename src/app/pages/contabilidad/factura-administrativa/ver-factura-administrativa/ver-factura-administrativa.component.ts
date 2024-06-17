import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-ver-factura-administrativa',
  templateUrl: './ver-factura-administrativa.component.html',
  styleUrls: ['./ver-factura-administrativa.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, DatePipe],
})
export class VerFacturaAdministrativaComponent implements OnInit {
  public idFactura = this.route.snapshot.params['id'];
  public Factura: any = [];
  public Cliente: any = [];
  public Descripciones: any[] = [];
  public notasCredito: any[] = [];
  public reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue.Subtotal);
  public reducer1 = (accumulator, currentValue) =>
    accumulator + parseInt(currentValue.Descuento_Factura);
  public Subtotal: any = 0;
  public Total: any = 0;
  public TotalNC = 0;
  public valorLetra = '';
  public contadorNC: number = 0;
  public configuracionGeneral: any[] = [];
  public firmaUsuario: any = '';
  public Impuesto: any = 0;
  public perfilUsuario = localStorage.getItem('miPerfil');
  public funcionario = JSON.parse(localStorage.getItem('User'));
  public Resolucion: any = {};

  public Actividades: any = [];

  Descuento: any;
  enviromen: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {
    this.http
      .get(environment.ruta + 'php/factura_administrativa/get_factura_administrativa.php', {
        params: { id: this.idFactura },
      })
      .subscribe((data: any) => {
        this.Factura = data.Datos;
        this.Resolucion = data.Resolucion;
        this.Cliente = data.Cliente;
        this.Descripciones = data.Descripciones;

        //this.notasCredito = data.NotasCredito;

        this.Subtotal = data.Subtotal;

        /*  this.valorLetra = data.letra; */

        this.Impuesto = data.Impuesto;

        this.Total = data.Total;
        this.Descuento = data.Descuento;
        this.Actividades = data.actividades;
        //this.contadorNC = this.notasCredito.length;
      });

    var usuario = JSON.parse(localStorage['User']);
    var NombreUsuario = usuario['Nombres'] + ' ' + usuario['Apellidos'];
    this.firmaUsuario = NombreUsuario;
  }

  ngOnInit() {}
}

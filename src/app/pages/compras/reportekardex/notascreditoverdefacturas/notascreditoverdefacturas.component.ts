import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-notascreditoverdefacturas',
  templateUrl: './notascreditoverdefacturas.component.html',
  styleUrls: ['./notascreditoverdefacturas.component.scss'],
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, CurrencyPipe, DatePipe],
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

  globales = environment;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    // this.user = JSON.parse(localStorage.User); /////////// REACIVAR
    console.log(this.idFactura, this.tipoFactura);
    this.http
      .get(this.globales.base_url + '/php/notas_credito_nuevo/get_nota_credito_por_factura.php', {
        params: { id_factura: this.idFactura, tipo_factura: this.tipoFactura },
      })
      .subscribe((res: any) => {
        this.Notas = res.Notas;
        this.Factura = res.Factura;
        this.Cliente = res.Cliente;

        this.Notas.forEach((nota: Array<any>) => {
          nota['Total'] = nota['Productos_Nota'].reduce(this.reducer, 0);
        });
      });
  }
}

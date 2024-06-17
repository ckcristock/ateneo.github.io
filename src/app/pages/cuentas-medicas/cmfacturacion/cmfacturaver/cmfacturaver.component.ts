import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globales } from 'src/app/pages/inventario/services/globales-datos';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ActividadComponent } from './actividad/actividad.component';
import { NotascreditoverdefacturasComponent } from './notascreditoverdefacturas/notascreditoverdefacturas.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { UserService } from 'src/app/core/services/user.service';
import { CabeceraComponent } from 'src/app/components/cabecera/cabecera.component';

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
    ActividadComponent,
    NotascreditoverdefacturasComponent,
    TableComponent,
    CabeceraComponent,
  ],
  providers: [RouterModule, Globales],
  selector: 'app-cmfacturaver',
  templateUrl: './cmfacturaver.component.html',
  styleUrls: ['./cmfacturaver.component.scss'],
})
export class CmfacturaverComponent implements OnInit {
  public environment: any;
  public id = this.route.snapshot.params['id'];
  public detalles: any = [];
  public productos: any[];
  public notasCredito: any[];
  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer1 = (accumulator, currentValue) =>
    accumulator +
    (parseFloat(currentValue.Impuesto) / 100) *
      (parseFloat(currentValue.Cantidad) * parseFloat(currentValue.Precio) -
        parseFloat(currentValue.Cantidad) * parseFloat(currentValue.Descuento));
  public reducer2 = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Descuento) * parseInt(currentValue.Cantidad);
  public Subtotal = 0;
  public Iva = 0;
  public Descuento = 0;
  public Total = 0;
  public TotalNC = 0;
  public valorLetra = '';
  public contadorNC: number;
  public configuracionGeneral: any[] = [];
  public firmaUsuario: any;
  public tipo: any;
  public resolucion_fact: any = [];
  public resolucion_hom: any = [];
  detalles_hom: any;
  productos_hom: any;
  Subtotal_hom: any;
  Iva_hom: any;
  Descuento_hom: any;
  Total_hom: number;
  valorLetra_hom: any;
  public withHom: number;
  public perfilUsuario = localStorage.getItem('miPerfil');
  public funcionario = JSON.parse(localStorage.getItem('User'));
  public Actividades: any = [];

  headerData: any = {
    Fecha: new Date(),
  };

  headerDataHom: any = {
    Fecha: new Date(),
  };

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public globales: Globales,
    private _user: UserService,
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.http
      .get(environment.ruta + '/php/facturasventas/detalle_factura_ver.php', {
        params: { id: id },
      })
      .subscribe((data: any) => {
        this.detalles = data.Datos;
        this.detalles_hom = data.Datos_hom;
        this.productos = data.Productos;
        this.productos_hom = data.Productos_hom;
        this.notasCredito = data.NotasCredito;
        this.resolucion_fact = data.resolucion_fact;
        this.resolucion_hom = data.resolucion_hom;
        this.withHom = data.withHom;
        this.headerData.Titulo = 'Factura ';
        this.headerData.Fecha = this.detalles.Fecha;
        this.headerData.Codigo = this.detalles.Codigo;
        if (this.resolucion_fact.Tipo_Resolucion == 'Resolucion_Electronica')
          this.headerData.Titulo += 'electrónica ';
        this.headerData.Titulo += 'de venta';

        this.headerDataHom.Titulo = 'Factura ';
        this.headerData.Fecha = this.detalles_hom.Fecha;
        if (this.resolucion_hom.Tipo_Resolucion == 'Resolucion_Electronica')
          this.headerData.Titulo += 'electrónica ';
        this.headerDataHom.Titulo += 'de venta';

        this.Actividades = data.actividades;

        this.loading = false;

        setTimeout(() => {
          this.Subtotal = this.productos.reduce(this.reducer, 0);
          this.Iva = this.productos.reduce(this.reducer1, 0);
          this.Descuento = this.productos.reduce(this.reducer2, 0);

          this.Total = this.Subtotal - this.Descuento + this.Iva - this.detalles.Cuota;

          if (this.withHom == 1) {
            // Si tiene homologo
            this.Subtotal_hom = this.productos_hom.reduce(this.reducer, 0);
            this.Iva_hom = this.productos_hom.reduce(this.reducer1, 0);
            this.Descuento_hom = this.productos_hom.reduce(this.reducer2, 0);

            this.Total_hom = this.Subtotal_hom - this.Descuento_hom + this.Iva_hom;
          }
        }, 200);

        this.valorLetra = data.letra;
        this.valorLetra_hom = data.letra_hom;

        this.tipo = data.tipo;
      });

    this.firmaUsuario = this._user.user.person['full_name'];
    this.environment = environment;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-inventario-vencer',
  templateUrl: './inventario-vencer.component.html',
  styleUrls: ['./inventario-vencer.component.scss'],
  standalone: true,
  imports: [CardComponent, TableComponent, MatFormFieldModule, MatInputModule, FormsModule],
})
export class InventarioVencerComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }
  public Vencidos: any = [];
  public filtro_nom: any = '';
  public filtro_lot: any = '';
  public filtro_pro: any = '';

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  public Cargando: boolean = false;

  constructor(
    private http: HttpClient,
    private location: Location,
  ) {}

  ngOnInit() {
    this.ListarVencidos();
  }
  ListarVencidos() {
    this.Cargando = true;
    this.http
      .get(environment.ruta + 'php/productosavencer/listar_productos_vencer.php')
      .subscribe((data: any) => {
        this.Vencidos = data.Lista;
        this.pagination.length = data.numReg;
        this.Cargando = false;
      });
  }
  paginacion() {
    let queryString = this.getQueryString(true);
    this.location.replaceState('/inventariovencer', queryString);
    this.http
      .get(environment.ruta + 'php/productosavencer/listar_productos_vencer.php' + queryString)
      .subscribe((data: any) => {
        this.Vencidos = data.Lista;
        this.pagination.length = data.numReg;
      });
  }
  filtros() {
    let queryString = this.getQueryString();
    this.location.replaceState('/inventariovencer', queryString);
    this.http
      .get(environment.ruta + 'php/productosavencer/listar_productos_vencer.php' + queryString)
      .subscribe((data: any) => {
        this.Vencidos = data.Lista;
        this.pagination.length = data.numReg;
      });
  }
  getQueryString(pagination: boolean = false) {
    let params: any = {};
    let queryString = '';

    if (this.filtro_nom != '') {
      params.nom = this.filtro_nom;
    }
    if (this.filtro_lot != '') {
      params.lot = this.filtro_lot;
    }
    if (this.filtro_pro != '') {
      params.pro = this.filtro_pro;
    }

    params.pag = this.pagination.page;

    queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    return queryString;
  }
}

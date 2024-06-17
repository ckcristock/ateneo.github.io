import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductoService } from '../../producto.service';
import { MatPaginator } from '@angular/material/paginator';
import { ModalasignarproductossimilaresComponent } from '../modalasignarproductossimilares/modalasignarproductossimilares.component';
import { AutocompleteMdlComponent } from '../../../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { ActionEditComponent } from '../../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-tablaproductossimilares',
  templateUrl: './tablaproductossimilares.component.html',
  styleUrls: ['./tablaproductossimilares.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    AutocompleteMdlComponent,
    ModalasignarproductossimilaresComponent,
  ],
})
export class TablaproductossimilaresComponent implements OnInit {
  public ProductosAsociados: Array<any> = [];
  public Cargando: boolean = false;
  public AbrirModalAsignarAsociados: Subject<any> = new Subject();
  public ProductosFiltrar: Array<any> = [];
  public CumFiltrar: Array<any> = [];
  public IdProductoAsociadoFiltrar: string = '';

  public Filtros: any = {
    id_producto: '',
    cum: '',
  };

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };

  constructor(private _productoService: ProductoService) {
    this.ConsultaFiltrada();
    this.GetProductosFiltrar();
  }

  ngOnInit() {}

  private _setFiltros() {
    let params: any = {};

    params.tam = this.pagination.pageSize;
    params.pag = this.pagination.page;

    if (this.Filtros.id_producto) {
      params.id_producto = this.Filtros.id_producto;
    }

    if (this.Filtros.cum.trim() != '') {
      params.cum = this.Filtros.cum;
    }

    return params;
  }

  public AbrirModalAsociarProductos(
    accion: string,
    idEdicion: string = '',
    idGrupoGenericos: string = '',
  ) {
    let p = { accion: accion, id_asociado: idEdicion, id_Genericos: idGrupoGenericos };
    this.AbrirModalAsignarAsociados.next(p);
  }

  public ConsultaFiltrada() {
    var params = this._setFiltros();

    this.Cargando = true;
    this._productoService.GetListaProductosAsociados(params).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ProductosAsociados = data.query_result;
        this.pagination.length = data.numReg;
      } else {
        this.ProductosAsociados = [];
        this.pagination.length = 0;
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
      }

      this.Cargando = false;
    });
  }

  public GetProductosFiltrar() {
    this._productoService.GetProductosFiltrar().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ProductosFiltrar = data.query_result.map((pro) => ({
          text: pro.label,
          ...pro,
        }));
      } else {
        this.ProductosFiltrar = [];
      }
    });
  }

  public GetCumFiltrar() {
    this._productoService.GetProductosFiltrar().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ProductosFiltrar = data.query_result.map((pro) => ({
          text: pro.label,
          ...pro,
        }));
      } else {
        this.ProductosFiltrar = [];
      }
    });
  }
}

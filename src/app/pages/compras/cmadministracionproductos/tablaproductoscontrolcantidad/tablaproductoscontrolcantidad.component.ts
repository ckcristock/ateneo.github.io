import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { GeneralService } from 'src/app/services/general.service';
import { ProductoService } from '../producto.service';
import { environment } from 'src/environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { ModalcontrolproductoComponent } from './modalcontrolproducto/modalcontrolproducto.component';
import { AutomaticSearchComponent } from '../../../../shared/components/automatic-search/automatic-search.component';
import { ActionButtonComponent } from '../../../../shared/components/standard-components/action-button/action-button.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-tablaproductoscontrolcantidad',
  templateUrl: './tablaproductoscontrolcantidad.component.html',
  styleUrls: ['./tablaproductoscontrolcantidad.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionButtonComponent,
    AutomaticSearchComponent,
    ModalcontrolproductoComponent,
  ],
})
export class TablaproductoscontrolcantidadComponent implements OnInit {
  public ProductosControlados: Array<any> = [];
  public Cargando: boolean = false;
  public AbrirModalControlProductos: Subject<any> = new Subject();
  public Funcionario = JSON.parse(localStorage.getItem('User'))?.Identificacion_Funcionario;

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

  globales = environment;

  constructor(
    private _swalService: SwalService,
    private _generalService: GeneralService,
    private _productoService: ProductoService,
    private http: HttpClient,
  ) {
    this.ConsultaFiltrada();
  }

  ngOnInit() {}

  private _setFiltros() {
    let params: any = {};

    params.tam = this.pagination.pageSize;
    params.pag = this.pagination.page;

    if (this.Filtros.id_producto != undefined && this.Filtros.id_producto?.trim() != '') {
      params.id_producto = this.Filtros.id_producto;
    }

    if (this.Filtros.cum.trim() != '') {
      params.cum = this.Filtros.cum;
    }

    return params;
  }

  public AbrirModalControlarProductos(accion: string, idEdicion: string = '') {
    let p = { accion: accion, id_controlado: idEdicion };
    this.AbrirModalControlProductos.next(p);
  }

  public ConsultaFiltrada() {
    var params = this._setFiltros();

    this.Cargando = true;
    this._productoService.GetListaProductosControlados(params).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ProductosControlados = data.query_result;
        this.pagination.length = data.numReg;
      } else {
        this.ProductosControlados = [];
        this.pagination.length = 0;
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
      }

      this.Cargando = false;
    });
  }

  public EliminarControl(idControl: string) {
    const request = (resolve) => {
      let data = new FormData();
      data.append('id_controlado', idControl);

      const request = () => {
        this._productoService.EliminarControl(data).subscribe((data: any) => {
          if (data.codigo == 'success') {
            let toastObj = {
              textos: [data.titulo, data.mensaje],
              tipo: data.codigo,
              duracion: 4000,
            };
            this.ConsultaFiltrada();
          } else {
            this._swalService.ShowMessage(data);
          }
        });
      };
      this._swalService.swalLoading(
        'Se dispone a eliminar el control de cantidad de este producto!',
        request,
      );
    };
  }

  public ActualizarDispensaciones(idControl) {
    let datos = new FormData();
    datos.append('id_controlado', idControl);
    const request = () => {
      this.http
        .post(this.globales.ruta + 'php/dispensaciones/actualiza_presentacion.php', datos)
        .subscribe(
          (data: any) => {
            this._swalService.ShowMessage(data);
          },
          (error) => {
            var msg = {
              title: 'Se perdió la conexión',
              text: 'Lo sentimos, ha ocurrido un error inesperado en el proceso de facturación. Si el problema persiste por favor comunicarse con soporte técnico antes de continuar intentando.',
              type: 'info',
            };
            this._swalService.ShowMessage(msg);
          },
        );
    };
    this._swalService.swalLoading(
      'Se dispone a actualizar todas las dispensaciones de este producto a la cantidad presentación!',
      request,
    );
  }
}

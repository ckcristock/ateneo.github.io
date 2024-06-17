import { NgClass, UpperCasePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { SwalService } from '../services/swal.service';
import { CatalogoService } from './catalogo.service';
import { ProductoService } from '../productos/producto.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { EmbalajeComponent } from './components/embalaje/embalaje.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { CategoriasService } from '../empresas/company-configuration/components/categorias/categorias.service';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    MatExpansionModule,
    MatListModule,
    NgClass,
    NotDataComponent,
    AddButtonComponent,
    RouterLink,
    HeaderButtonComponent,
    TableComponent,
    LoadImageComponent,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    EmbalajeComponent,
    UpperCasePipe,
    CapitalLetterPipe,
  ],
})
export class CatalogoComponent implements OnInit {
  public Categorias: any[] = [];
  public Subcategorias: any[] = [];
  public Productos: any[] = [];
  public tipos_catalogo: any[] = [];
  public selectedCategory: any = {
    categoria: {
      id: '',
      nombre: '',
    },
    subcategoria: {
      id: '',
      nombre: '',
    },
  };
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  alerta: any = {
    senyal: '',
    texto: '',
  };
  Object = Object;
  orderObj: any;
  filtroActivado: boolean = false;
  event = new EventEmitter<Event>();
  formFiltros!: UntypedFormGroup;
  productoDetalle: any = {};
  filtroDefault: any = {};
  productoDefault: any = {};
  active = 1;
  loadingCategorias: boolean = false;
  loadingProductos: boolean = false;

  title: string = '';
  permission: Permissions = {
    menu: 'Catálogo',
    permissions: {
      show: true,
    },
  };

  constructor(
    public router: Router,
    private _permission: PermissionService,
    private _categoria: CategoriasService,
    private _swal: SwalService,
    private _producto: ProductoService,
    private _catalogo: CatalogoService,
    private fb: UntypedFormBuilder,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createForms();
      this.getCategorias();
      this.getUrlFilters();
    } else {
      this.router.navigate(['/notauthorized']);
    }
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.formFiltros.patchValue(this.urlFiltersService.currentFilters);
    const {
      categoria = '',
      subcategoria = '',
      nom_categoria = '',
      nom_subcategoria = '',
    } = this.urlFiltersService.currentFilters;
    this.selectedCategory.categoria = {
      id: categoria,
      nombre: nom_categoria,
    };
    this.selectedCategory.subcategoria = {
      id: subcategoria,
      nombre: nom_subcategoria,
    };
    if (this.selectedCategory.categoria.id) {
      this.getProductosBySubcategoria(this.selectedCategory);
    }
  }

  resetFiltros() {
    this.formFiltros.reset(this.filtroDefault, { emitEvent: false });
    this.filtroActivado = false;
    this.alerta = {
      senyal: '',
      texto: '',
    };
  }

  SetFiltros(data: any) {
    let params = new HttpParams();
    data.categoria = this.selectedCategory.categoria.id ? data.categoria : '';
    data.subcategoria = this.selectedCategory.subcategoria.id ? data.subcategoria : '';
    data.nom_categoria = this.selectedCategory.categoria.id
      ? this.selectedCategory.categoria.nombre
      : '';
    data.nom_subcategoria = this.selectedCategory.subcategoria.id
      ? this.selectedCategory.subcategoria.nombre
      : '';
    this.Object.keys(data).forEach((control) => {
      if (data[control]) {
        params = params.set(control, data[control]);
      }
    });
    return params;
  }

  moveToTop() {
    // window.scroll(0,0);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  createForms() {
    this.formFiltros = this.fb.group({
      nombre: [''],
      estado: [''],
      imagen: [''],
    });
    this.filtroDefault = this.formFiltros.value;

    this.formFiltros.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.getProducts();
    });
  }

  getCategorias() {
    this.loadingCategorias = true;
    this._categoria.getCategorias().subscribe((res: any) => {
      this.Categorias = res.data;
      this.loadingCategorias = false;
    });
  }

  getProducts() {
    let params = {
      ...this.pagination,
      ...this.formFiltros.value,
      categoria:
        this.selectedCategory.categoria.id !== undefined ? this.selectedCategory.categoria.id : '',
      subcategoria:
        this.selectedCategory.subcategoria.id !== undefined
          ? this.selectedCategory.subcategoria.id
          : '',
    };
    this.loadingProductos = true;

    this._producto.paginate(params).subscribe((res: any) => {
      if (!res) return;
      this.Productos = res.data.data;
      this.pagination.length = res.data.total;
      this.loadingProductos = false;
    }); /*  */
    const urlParams = {
      ...params,
      nom_categoria: this.selectedCategory.categoria.nombre,
      nom_subcategoria: this.selectedCategory.subcategoria.nombre,
    };
    this.urlFiltersService.setUrlFilters(urlParams);
  }

  getProductosBySubcategoria(categoria: any, clickedFlag = true) {
    if (clickedFlag) {
      this.moveToTop();
      this.resetFiltros();
      this.selectedCategory = categoria;
    }
  }

  async cambiarEstado(producto: any, state: any) {
    let data = {
      id: producto.Id_Producto,
      estado: state,
    };
    try {
      await this._swal.confirm(
        '¡El producto será ' + (producto.Estado == 'activo' ? 'inactivado!' : 'activado!'),
        {
          preConfirm: () => {
            return new Promise((resolve) => {
              this._catalogo.changeEstado(data).subscribe({
                next: () => {
                  this.getProducts();
                  this._swal.show({
                    icon: 'success',
                    title: 'Tarea completada con éxito!',
                    text:
                      'El producto ha sido ' +
                      (producto.Estado == 'inactivo' ? 'activado' : 'inactivado') +
                      ' con éxito.',
                    timer: 1000,
                    showCancel: false,
                  });
                  resolve(true);
                },
                error: () => {
                  resolve(false);
                },
              });
            });
          },
          showLoaderOnConfirm: true,
        },
      );
    } catch (error) {
      this._swal.hardError();
    }
  }
}

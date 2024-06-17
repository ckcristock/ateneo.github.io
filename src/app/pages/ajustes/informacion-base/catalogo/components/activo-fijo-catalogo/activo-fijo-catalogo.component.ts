import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import {
  UntypedFormBuilder,
  UntypedFormArray,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import { SwalService } from '../../../services/swal.service';
import { User } from 'src/app/core/models/users.model';
import { UserService } from 'src/app/core/services/user.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-activo-fijo-catalogo',
  templateUrl: './activo-fijo-catalogo.component.html',
  styleUrls: ['./activo-fijo-catalogo.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    NgbPagination,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    NgSelectModule,
    TextFieldModule,
    NotDataComponent,
    TitleCasePipe,
  ],
})
export class ActivoFijoCatalogoComponent implements OnInit {
  @Input('user') user!: User;

  @ViewChild('modalGenerico') modal: any;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
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

  loading = false;
  form!: UntypedFormGroup;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0,
  };

  Categorias: any[] = [];
  TipoActivos: any[] = [];
  actives: any[] = [];

  SubCategorias: any[] = [];

  constructor(
    private _category: CategoryService,
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private _user: UserService,
    private swal: SwalService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCategory();
    this.GetTipoActivos();
    this.getActives();
  }

  GetTipoActivos() {
    this.http
      .get(environment.base_url + '/php/tipoactivo/get_tipo_activos.php')
      .subscribe((data: any) => {
        if ((data.codigo = 'success')) {
          this.TipoActivos = data.query_result;
        } else {
          this.TipoActivos = [];
          /*  this.ShowSwal(data.codigo, data.titulo, data.mensaje); */
        }
      });
  }
  getSubcategories() {
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Subcategoria' },
      })
      .subscribe((data: any) => {
        this.SubCategorias = data;
      });
  }
  getSubCategoryEdit(Id_Producto: any, Id_Subcategoria: any) {
    this._category.getSubCategoryEdit(Id_Producto, Id_Subcategoria).subscribe((r: any) => {
      this.fieldDinamic.clear();
      r.data.forEach((e: any) => {
        let group = this.fb.group({
          subcategory_variables_id: e.subcategory_variables_id,
          id: e.id,
          label: e.label,
          type: e.type,
          valor: e.valor,
        });
        this.fieldDinamic.push(group);
      });
    });
  }

  getDinamicField(Id_Subcategoria: any, Id_Producto = null) {
    this.getSubCategoryEdit(Id_Producto, Id_Subcategoria);
  }

  createForm() {
    this.form = this.fb.group({
      Id_Producto: [''],
      Id_Categoria: [''],
      Id_Subcategoria: [''],
      company_id: [this._user.user.person.company_worked.id],
      Nombre_Comercial: [''],
      Descripcion_ATC: [''],
      Codigo_Barras: [''],
      Id_Tipo_Activo_Fijo: [''],
      Invima: [''],
      Tipo_Catalogo: ['Activo_Fijo'],
      Orden_Compra: [1],
      Referencia: [''],
      dynamic: this.fb.array([]),
    });
  }
  get fieldDinamic() {
    return this.form.get('dynamic') as UntypedFormArray;
  }

  getCategory() {
    this._category.getCategories().subscribe((r: any) => {
      this.Categorias = r.data;
      this.Categorias.unshift({ text: 'Seleccione ', value: '' });
    });
  }

  getSubCategories(Id_Categoria_Nueva: any) {
    this._category.getSubCategories(Id_Categoria_Nueva).subscribe((r: any) => {
      this.SubCategorias = r.data;
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  closeResult = '';
  public openConfirm(confirm: any) {
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  private getDismissReason(reason: any) {
    this.form.reset();
    this.fieldDinamic.clear();
  }

  saveGeneric() {
    const request = () => {
      if (this.form.get('Id_Producto')?.value) {
        this._category
          .updateProduct(this.form.value, this.form.get('Id_Producto')?.value)
          .subscribe((r: any) => {
            // this.dataClear();
            this.swal.show({
              icon: 'success',
              title: 'Producto editado con éxito',
              text: '',
              showCancel: false,
            });
            this.getActives();
            this.modalService.dismissAll();
          });
      } else {
        this._category.save(this.form.value).subscribe((r: any) => {
          this.swal.show({
            icon: 'success',
            title: 'Producto creado con éxito',
            text: '',
            showCancel: false,
          });
          this.getActives();
          this.modalService.dismissAll();
        });
      }
    };
    this.swal.swalLoading('Se dispone a guardar este genérico', request);
  }

  getActives(page = 1) {
    this.loading = true;
    this.pagination.page = page;
    let params = {
      tipo: 'Activo_Fijo',
      ...this.pagination,
      company_id: this._user.user.person.company_worked.id,
    };
    this._category.getProducts(params).subscribe((r: any) => {
      this.loading = false;
      this.actives = r.data.data;
      this.pagination.collectionSize = r.data.total;
    });
  }

  editGeneric(producto: any) {
    /*    this.Producto = {...producto};
    this.title = 'Editar Producto'; */
    this.form.patchValue({
      Id_Producto: producto.Id_Producto,
      Referencia: producto.Referencia,
      Descripcion_ATC: producto.Descripcion_ATC,
      Codigo_Barras: producto.Codigo_Barras,
      Invima: producto.Invima,
      Id_Categoria: Number(producto.Id_Categoria),
      Id_Subcategoria: Number(producto.Id_Subcategoria),
      Nombre_Comercial: producto.Nombre_Comercial,
      Id_Tipo_Activo_Fijo: Number(producto.Id_Tipo_Activo_Fijo),
    });
    this.getSubCategories(producto.Id_Subcategoria);
    this.fieldDinamic.clear();
    this.getSubCategoryEdit(producto.Id_Producto, producto.Id_Subcategoria);
  }
}

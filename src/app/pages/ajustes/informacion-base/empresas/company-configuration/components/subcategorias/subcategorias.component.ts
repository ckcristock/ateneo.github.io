import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SubcategoryService } from './subcategory.service';
import { UserService } from 'src/app/core/services/user.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CategoriasService } from '../categorias/categorias.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { SwalService } from '../../../../services/swal.service';

@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.component.html',
  styleUrls: ['./subcategorias.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatInputModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    MatPaginatorModule,
    NotDataComponent,
    ReactiveFormsModule,
    AutocompleteFcComponent,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    StandardModule,
    AddButtonComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
  ],
})
export class SubcategoriasComponent implements OnInit {
  @ViewChild('modal') modal: any;

  @Input()
  set reloadSubcategories(param: { evento: Event; filtro?: string | '' }) {
    if (param.evento) {
      this.restriccionDesdeCatalogo = true;
      this.filters.nombre = param.filtro;
      this.getSubcategories();
      this.listCategories();
    }
  }

  /*Variable para evitar que cuando se llame a este componente desde "CatalogoComponent",
    el usuario haga otras cosas aparte del motivo principal del llamado. */
  restriccionDesdeCatalogo: boolean = false;
  form: UntypedFormGroup;
  filters = {
    Id_Categoria_Nueva: '',
    nombre: '',
  };

  permission: Permissions = {
    menu: 'Empresa',
    permissions: {
      approve_product_categories: true,
    },
  };
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  public categorias_filtro: any = [];
  public Bodegas: any[] = [];
  public Cargando: boolean;
  public Sucategories: any[] = [];
  public Subcategory: any = {};
  public title: string = 'Nueva Subcategoria';
  public company_id: any = '';
  public Retencion: any = {
    Nombre: '',
    Id_Bodega: '',
    Separable: 'No',
  };
  public EditFlag: boolean = false;
  currentCompany: any;

  constructor(
    private _subcategory: SubcategoryService,
    private _category: CategoriasService,
    private _user: UserService,
    private _swalService: SwalService,
    private fb: UntypedFormBuilder,
    private _modalSubcat: ModalService,
    private _permission: PermissionService,
    public rutaActiva: ActivatedRoute,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
    this.company_id = this._user.user.person.company_worked.id;
  }

  ngOnInit() {
    this.currentCompany = this.rutaActiva.snapshot.params.id;
    this.createForm();
    this.getSubcategories();
    this.listCategories();
  }

  openModal(content, accion, data?) {
    this.title = accion + ' subcategoria';
    this.fieldDinamic.clear();
    if (accion == 'Agregar') {
      this.Subcategory = {};
      this.createForm();
    } else {
      this.EditSubcategory(data);
    }
    this._modalSubcat.open(content, 'lg');
  }

  createForm() {
    this.form = this.fb.group({
      Id_Subcategoria: [''],
      Nombre: ['', Validators.required],
      Id_Categoria_Nueva: [null, Validators.required],
      Fijo: [0],
      dynamic: this.fb.array([]),
    });

    this.form.get('Nombre')[this.restriccionDesdeCatalogo ? 'disable' : 'enable']();
    this.form.get('Id_Categoria_Nueva')[this.restriccionDesdeCatalogo ? 'disable' : 'enable']();
    this.form.get('Fijo')[this.restriccionDesdeCatalogo ? 'disable' : 'enable']();
  }

  dinamicFields() {
    let field = this.fb.group({
      id: [''],
      label: ['', Validators.required],
      type: ['', Validators.required],
      required: ['', Validators.required],
      reception: [0],
      // lists: [0],
    });
    return field;
  }

  newField() {
    let field = this.fieldDinamic;
    field.push(this.dinamicFields());
  }

  get fieldDinamic() {
    return this.form.get('dynamic') as UntypedFormArray;
  }

  deleteField(i, item) {
    this._swalService
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: 'Vamos a eliminar este campo, esta acción no se puede revertir',
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (item.controls.id.value) {
            this._subcategory.deleteVariable(item.controls.id.value).subscribe((data: any) => {});
          }
          this.fieldDinamic.removeAt(i);
        }
      });
  }

  listCategories() {
    let param = { company_id: this.currentCompany };
    // param ? param.company_id = parseInt(this.currentCompany) : ''
    this._category.listarCategorias(param).subscribe((res: any) => {
      this.categorias_filtro = res.data;
    });
  }

  getSubcategories() {
    this.Cargando = true;
    /* this.http
      .get(environment.ruta + 'php/parametros/lista_subcategoria.php', { params: { company_id: this._user.user.person.company_worked.id } }) */
    let param: any = { ...this.pagination, ...this.filters };
    param ? (param.company_id = parseInt(this.currentCompany)) : '';
    this._subcategory.getSubCategorias(param).subscribe((res: any) => {
      this.Cargando = false;
      this.Sucategories = res.data.data;
      this.pagination.length = res.data.total;
      /* this.Sucategories = data; */
    });
  }

  EditSubcategory(data) {
    this.Subcategory = { ...data };
    this.title = 'Editar subcategoria';
    /* this.Subcategory.categories=this.Subcategory.categories.map(v => v=v.Id_Categoria_Nueva) */
    this.form.patchValue({
      Id_Subcategoria: this.Subcategory.Id_Subcategoria,
      Nombre: this.Subcategory.Nombre,
      Id_Categoria_Nueva: this.Subcategory.Id_Categoria_Nueva,
      Fijo: this.Subcategory.Fijo,
      /* Categorias: this.Subcategory.categories */
    });
    this.Subcategory.subcategory_variables.forEach((element) => {
      let group = this.fb.group({
        id: element.id,
        label: element.label,
        type: element.type,
        required: element.required,
        reception: element.reception,
        // lists: element.lists,
      });
      this.fieldDinamic.push(group);
    });
  }

  async SaveSubcategory() {
    if (this.form.valid) {
      let bool = this.form.value.Id_Subcategoria ? true : false;
      try {
        await this._swalService.confirm(`Vamos a ${bool ? 'editar' : 'crear'} la subcategoría.`, {
          preConfirm: () => {
            return new Promise((resolve) => {
              this._subcategory.save(this.form.value).subscribe({
                next: () => {
                  this.dataClear();
                  this._swalService.show({
                    icon: 'success',
                    title: 'Subcategoria ' + (bool ? 'editada' : 'creada') + ' con éxito',
                    text: '',
                    showCancel: false,
                    timer: 1000,
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
        });
      } catch (error) {
        this._swalService.hardError();
      }
    } else {
      this._swalService.show({
        icon: 'error',
        title: 'Validación no superada',
        text: 'Por favor verifique de nuevo la información.',
        showCancel: false,
      });
    }
  }

  dataClear() {
    this.form.reset();
    this.fieldDinamic.clear();
    this.getSubcategories();
    this._modalSubcat.close();
  }

  activateSubcategory(id, state) {
    this._swalService
      .show({
        title: '¿Estás seguro(a)?',
        text: '¡Esta subcategoría se ' + (state == 0 ? 'anulará!' : 'reactivará!'),
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._subcategory.changeActive(id, { activo: state }).subscribe((res: any) => {
            this.getSubcategories();
            this._swalService.show({
              icon: 'success',
              title: '¡Operación exitosa!',
              text: res.data,
              timer: 1000,
              showCancel: false,
            });
          });
        }
      });
  }
}

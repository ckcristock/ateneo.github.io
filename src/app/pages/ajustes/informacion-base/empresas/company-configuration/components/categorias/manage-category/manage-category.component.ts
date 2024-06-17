import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CategoriasService } from '../categorias.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from '@app/core/services/permission.service';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss',
})
export class ManageCategoryComponent implements OnInit {
  @Input() data!: any;

  @Input() currentCompany = 0;

  permission: Permissions = {
    menu: 'Empresas',
    permissions: {
      approve_product_categories: true,
    },
  };

  formCategory: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly swalService: SwalService,
    private readonly categoryService: CategoriasService,
    private permissionService: PermissionService,
    private readonly modalService: NgbModal,
  ) {
    this.permission = this.permissionService.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    this.formInit();
    if (this.data) this.handleData();
  }

  private formInit() {
    this.formCategory = this.formBuilder.group({
      Id_Categoria_Nueva: [''],
      Nombre: ['', Validators.required],
      Compra_Internacional: ['', Validators.required],
      Fijo: [0],
      dynamic: this.formBuilder.array([]),
      is_shooting: [false],
      receives_barcode: [false],
      is_stackable: [false],
      is_inventory: [false],
      is_listed: [false],
    });
  }

  private handleData() {
    const booleanName = [
      'is_shooting',
      'is_listed',
      'is_inventory',
      'is_stackable',
      'receives_barcode',
    ];
    for (const value of booleanName) {
      this.data[value] = Boolean(this.data[value]);
    }
    this.formCategory.patchValue(this.data);
    (this.data.category_variables as Array<any>).forEach((element) => {
      this.fieldDinamic.push(
        this.formBuilder.group({
          id: element.id,
          label: element.label,
          type: element.type,
          required: element.required,
          reception: element.reception,
          lists: element.lists,
        }),
      );
    });
  }

  newField() {
    this.fieldDinamic.push(
      this.formBuilder.group({
        id: [''],
        label: ['', Validators.required],
        type: ['', Validators.required],
        required: ['', Validators.required],
        reception: [0],
        lists: [0],
      }),
    );
  }

  deleteField(i: number, item: any) {
    this.swalService
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: 'Vamos a eliminar este campo, esta acción no se puede revertir',
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (item.controls.id.value)
            this.categoryService.deleteVariable(item.controls.id.value).subscribe();
          this.fieldDinamic.removeAt(i);
        }
      });
  }

  saveCategory() {
    if (this.formCategory.valid) {
      const request = () => {
        this.categoryService
          .saveCategoria({ ...this.formCategory.value, company_id: this.currentCompany })
          .subscribe({
            next: () => {
              this.modalService.dismissAll('success');
              this.swalService.show({
                icon: 'success',
                title: 'Categoría ' + (this.data ? 'editada' : 'creada') + ' con éxito.',
                text: '',
                timer: 2000,
                showCancel: false,
              });
            },
            error: () => {
              this.swalService.hardError();
            },
          });
      };
      this.swalService.swalLoading(
        `Vamos a ${this.data ? 'editar' : 'crear'} la categoría`,
        request,
      );
    } else this.swalService.incompleteError();
  }

  get fieldDinamic() {
    return this.formCategory.get('dynamic') as FormArray;
  }
}

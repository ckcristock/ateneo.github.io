import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  NgbModal,
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
} from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { TercerosService } from '../terceros.service';
import { UpperCasePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { debounceTime } from 'rxjs/operators';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgSelectModule,
    MatCheckboxModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    MatPaginatorModule,
    MatSelectModule,
    NotDataComponent,
    TextFieldModule,
    UpperCasePipe,
    LowerCasePipe,
    TitleCasePipe,
    CapitalLetterPipe,
    StandardModule,
    ActionEditComponent,
    AddButtonComponent,
  ],
})
export class PersonasComponent implements OnInit {
  checkPersona: boolean = true;
  checkTercero: boolean = true;
  checkTelefono: boolean = true;
  checkEmail: boolean = true;
  checkCargo: boolean = true;
  paginacion: any;
  estadoFiltros = false;
  person: any = {};
  thirds: any[] = [];
  closeResult = '';
  form: UntypedFormGroup;
  form_filters: UntypedFormGroup;
  people: any[] = [];
  loading: boolean = false;
  paginationMaterial: any;
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtrosActivos: boolean = false;
  permission: Permissions = {
    menu: 'Terceros.',
    permissions: {
      show: true,
    },
  };

  constructor(
    private _terceros: TercerosService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private _validators: ValidatorsService,
    private _permission: PermissionService,
    private paginator: MatPaginatorIntl,
    private _swal: SwalService,
    private router: Router,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.paginator.itemsPerPageLabel = 'Items por página:';
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.getUrlFilters();
      this.getPerson();
      this.createForm();
      this.getThirds();
    } else {
      this.router.navigate(['/notauthorized']);
    }
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    const sizeStorage = +localStorage.getItem('paginationItemsThirdPartyPeople');
    if (sizeStorage) this.pagination.pageSize = sizeStorage;
    this.form_filters.patchValue(this.urlFiltersService.currentFilters);
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      name: '',
      third: '',
      phone: '',
      email: '',
      cargo: '',
      observacion: '',
      documento: '',
    });
    this.form_filters.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.getPerson();
    });
  }

  personForm(person) {
    this.person = { ...person };
    this.form.patchValue({
      id: this.person.id,
      name: this.person.name,
      n_document: this.person.n_document,
      landline: this.person.landline,
      cell_phone: this.person.cell_phone,
      email: this.person.email,
      position: this.person.position,
      observation: this.person.observation,
      third_party_id: this.person.third_party_id,
    });
  }

  public openConfirm(confirm) {
    this.getThirdsForCreate();
    this.modalService
      .open(confirm, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'md',
        scrollable: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed `;
        },
      );
  }

  thirds_aux: any[] = [];

  getThirds() {
    this._terceros.getThirds().subscribe((r: any) => {
      this.thirds = r.data;
      this.thirds.unshift({ text: 'Sin tercero', value: null });
      this.thirds.unshift({ text: 'Todos', value: '' });
    });
  }

  getThirdsForCreate() {
    this._terceros.getThirds().subscribe((r: any) => {
      this.thirds_aux = r.data;
      this.thirds_aux.unshift({ text: 'SIN TERCERO', value: null });
    });
  }

  handlePageEvent() {
    localStorage.setItem('paginationItemsThirdPartyPeople', this.pagination.pageSize.toString());
    this.getPerson();
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: [
        '',
        [this._validators.required, this._validators.maxLength(50), this._validators.minLength(3)],
      ],
      n_document: ['', this._validators.max(99999999999)],
      landline: ['', this._validators.maxLength(50)],
      cell_phone: ['', this._validators.maxLength(50)],
      email: ['', [Validators.email, this._validators.maxLength(50)]],
      position: ['', this._validators.maxLength(50)],
      observation: ['', this._validators.maxLength(65535)],
      third_party_id: [null],
    });
  }

  getPerson() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.form_filters.value,
    };
    this._terceros.getThirdPartyPerson(params).subscribe((r: any) => {
      this.people = r.data.data;
      this.loading = false;
      this.pagination.length = r.data.total;
      if (this.paginationMaterial?.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1;
        this.pagination.page = 1;
        this.getPerson();
      }
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  addPerson() {
    if (this.form.valid) {
      this._terceros.addThirdPartyPerson(this.form.value).subscribe((res: any) => {
        if (res.status) {
          this._swal.show({
            title: res.data,
            icon: 'success',
            text: '',
            timer: 1000,
            showCancel: false,
          });
          this.getPerson();
          this.modalService.dismissAll();
        } else {
          this._swal.show({
            title: 'Error',
            icon: 'error',
            text: res.err,
            showCancel: false,
          });
        }
      });
    } else {
      this.form.touched;
      this._swal.incompleteError();
    }
  }

  get name_valid() {
    const nameControl = this.form.get('name');
    return nameControl.invalid && nameControl.touched;
  }

  get name_error_message() {
    const nameControl = this.form.get('name');
    if (nameControl.errors) {
      if (nameControl.errors.maxLength) {
        return nameControl.errors.maxLength.msj;
      } else if (nameControl.errors.minLength) {
        return nameControl.errors.minLength.msj;
      }
    }
    return 'Campo obligatorio';
  }

  get n_document_valid() {
    const nameControl = this.form.get('n_document');
    if (nameControl.errors && nameControl.errors.max) {
      return nameControl.errors.max.msj;
    }
    return 'Campo obligatorio';
  }
  get email_valid() {
    return this.form.get('email').invalid && this.form.get('email').touched;
  }
}

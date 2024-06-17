import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { ModalService } from 'src/app/core/services/modal.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PrettyCashService } from 'src/app/core/services/pretty-cash.service';
import { UserService } from 'src/app/core/services/user.service';
import { PersonService } from '../../ajustes/informacion-base/services/person/person.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { CrearCajaComponent } from './crear-caja/crear-caja.component';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styleUrls: ['./cajas.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf,
    NgFor,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    CrearCajaComponent,
    NotDataComponent,
    ReactiveFormsModule,
    NgSelectModule,
    DecimalPipe,
  ],
})
export class CajasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  newPrettyCash = new EventEmitter<Boolean>();
  loading: boolean = false;
  form: FormGroup;
  prettyCashList: any[] = [];
  people: any[] = [];
  id_caja: any;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0,
  };
  filtros = {
    name: '',
    person_id: '',
  };
  permission: Permissions = {
    menu: 'Cajas',
    permissions: {
      show: true,
      show_all: true,
    },
  };

  constructor(
    private _prettyCash: PrettyCashService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _person: PersonService,
    private _swal: SwalService,
    private router: Router,
    public _user: UserService,
    private _permission: PermissionService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.filtros.person_id = this.permission.permissions.show_all
        ? ''
        : this._user.user.person.id;
      this.getPrettyCash();
    } else {
      this.router.navigate(['/notauthorized']);
    }
  }

  getPeople() {
    this._person.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data;
    });
  }

  async openModal(content, item) {
    this.form = this.fb.group({
      /* id: [''], */
      person_id: ['', Validators.required],
      description: ['', Validators.required],
      status: [''],
    });
    this.getPeople();
    await this._prettyCash
      .getCaja(item.id)
      .toPromise()
      .then((res: any) => {
        this.id_caja = res.data.id;
        this.form.patchValue({
          /* id: res.data.id, */
          person_id: res.data.person_id,
          description: res.data.description,
          status: res.data.status,
        });
      });
    this._modal.open(content);
  }

  save() {
    if (this.form.get('person_id').valid) {
      this.form.patchValue({
        status: 'Activa',
      });
    }
    this._prettyCash.update(this.form.value, this.id_caja).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: res.data,
        text: '',
        showCancel: false,
        timer: 1000,
      });
      this._modal.close();
      this.getPrettyCash();
    });
  }

  getPrettyCash(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this._prettyCash.getAll(params).subscribe((r: any) => {
      this.prettyCashList = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    });
  }
}

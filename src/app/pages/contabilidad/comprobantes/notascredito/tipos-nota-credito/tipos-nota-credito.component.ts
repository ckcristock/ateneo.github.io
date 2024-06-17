import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TiposNotaCreditoService } from './tipos-nota-credito.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { debounceTime } from 'rxjs/operators';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, UpperCasePipe, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-tipos-nota-credito',
  templateUrl: './tipos-nota-credito.component.html',
  styleUrls: ['./tipos-nota-credito.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    NgFor,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    NotDataComponent,
    UpperCasePipe,
    DatePipe,
  ],
})
export class TiposNotaCreditoComponent implements OnInit {
  loading: boolean = false;
  materialPag: any;
  title: any;
  creditNoteTypes: any[] = [];
  pagination: any = {
    page: 1,
    pageSize: 15,
    collectionSize: 0,
  };
  formFilters: FormGroup;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _tiposNotaCredito: TiposNotaCreditoService,
    private _modal: ModalService,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.createFormFilters();
    this.paginate();
  }

  openModal(modal, title, cnt = null) {
    if (cnt) {
      this.form.patchValue({
        ...cnt,
      });
    } else {
      this.form.patchValue({
        status: 'Activo',
      });
    }
    this.title = title == 'new' ? 'Agregar tipo' : 'Editar tipo';
    this._modal.open(modal, 'sm');
  }

  createForm() {
    this.form = this.fb.group({
      id: [],
      name: ['', Validators.required],
      status: ['Activo'],
    });
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      name: ['', Validators.required],
    });
    this.formFilters
      .get('name')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        this.paginate();
      });
  }

  paginate(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value,
    };
    this._tiposNotaCredito.paginate(params).subscribe((res: any) => {
      this.creditNoteTypes = res.data.data;
      this.materialPag = res.data;
      this.loading = false;
      this.pagination.collectionSize = res.data.total;
    });
  }

  create() {
    if (this.form.valid) {
      this._tiposNotaCredito.create(this.form.value).subscribe((res: any) => {
        if (res.status) {
          this.form.reset();
          this._modal.close();
          this.paginate();
          this._swal.show({
            icon: 'success',
            title: res.data,
            text: '',
            showCancel: false,
            timer: 1000,
          });
        } else {
          this._swal.hardError();
        }
      });
    } else {
      this._swal.incompleteError();
    }
  }

  changeStatus(cnt) {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a cambiar el estado.',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this.form.patchValue({
            ...cnt,
            status: cnt.status == 'activo' ? 'Inactivo' : 'Activo',
          });
          this.create();
        }
      });
  }
}

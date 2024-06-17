import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { EmbalajeService } from './embalaje.service';
import { SwalService } from '../../../services/swal.service';
import { MatPaginator } from '@angular/material/paginator';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { TableComponent } from '../../../../../../shared/components/standard-components/table/table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-embalaje',
  templateUrl: './embalaje.component.html',
  styleUrls: ['./embalaje.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TableComponent,
    NotDataComponent,
    UpperCasePipe,
    DatePipe,
  ],
})
export class EmbalajeComponent implements OnInit {
  @ViewChild('addPackaging') addPackaging: any;
  form!: UntypedFormGroup;
  packagings: any[] = [];
  loading!: boolean;
  title = 'Nuevo';
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  constructor(
    private _modal: ModalService,
    private _embalaje: EmbalajeService,
    private _swal: SwalService,
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {}

  openModal() {
    this._modal.open(this.addPackaging);
    this.createForm();
    this.paginate();
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
    });
    this.form.get('name')?.valueChanges.subscribe((r) => {
      if (!r) {
        this.form.reset();
        this.title = 'Nuevo';
      }
    });
  }

  edit(item: any) {
    this.title = 'Editar';
    this.form.patchValue({
      ...item,
    });
  }

  paginate(pageObj?: MatPaginator) {
    this.pagination.page = (pageObj?.pageIndex || 0) + 1 || 1;
    this.pagination.pageSize = pageObj?.pageSize || 5;
    this.loading = true;
    this._embalaje.paginate(this.pagination).subscribe((res: any) => {
      if (!res) return;
      this.packagings = res.data.data;
      this.pagination.length = res.data.total;
      this.loading = false;
    });
  }

  async save() {
    if (this.form.valid) {
      try {
        await this._swal.confirm(
          this.title == 'Nuevo'
            ? 'Vamos a agregar un nuevo embalaje'
            : 'Vamos a editar el embalaje',
          {
            preConfirm: () => {
              return new Promise((resolve) => {
                this._embalaje.store(this.form.value).subscribe({
                  next: (res: any) => {
                    if (res.status) {
                      this._swal.show({
                        icon: 'success',
                        title: res.data,
                        text: '',
                        showCancel: false,
                        timer: 1000,
                      });
                      this.form.reset();
                      this.paginate();
                      this.title = 'Nuevo';
                    } else {
                      this._swal.hardError();
                    }
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
    } else {
      this._swal.incompleteError();
    }
  }
}

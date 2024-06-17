import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { Component, OnInit } from '@angular/core';
import { ConsecutivosService } from './consecutivos.service';
import { debounceTime } from 'rxjs/operators';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { LowerCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ModalService } from 'src/app/core/services/modal.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { Router } from '@angular/router';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { UserService } from 'src/app/core/services/user.service';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-consecutivos',
  templateUrl: './consecutivos.component.html',
  styleUrls: ['./consecutivos.component.scss'],
  standalone: true,
  imports: [
    ActionEditComponent,
    CardComponent,
    DropdownActionsComponent,
    FormsModule,
    LowerCasePipe,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    TableComponent,
  ],
})
export class ConsecutivosComponent implements OnInit {
  today = new Date();
  today_ = {
    anio: '',
    mes: '',
    dia: '',
  };
  consecutivo_numero: any;
  form_filters!: UntypedFormGroup;
  form!: UntypedFormGroup;
  loading: boolean = true;
  id!: number;
  titulo_consecutivo!: string;
  consecutivos: any[] = [];
  pagination = {
    page: 0,
    pageSize: 0,
    length: 0,
  };
  permission: Permissions = {
    menu: 'Consecutivos',
    permissions: {
      show: true,
    },
  };

  constructor(
    private _consecutivo: ConsecutivosService,
    private _modal: ModalService,
    private _permission: PermissionService,
    private _swal: SwalService,
    private _userService: UserService,
    private fb: UntypedFormBuilder,
    public router: Router,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.today_.anio = this.today.toLocaleDateString('es', { year: '2-digit' });
      this.today_.mes = this.today.toLocaleDateString('es', { month: '2-digit' });
      this.today_.dia = this.today.toLocaleDateString('es', { day: '2-digit' });
      this.createFormFilters();
      this.getUrlFilters();
    } else {
      this.router.navigate(['/notauthorized']);
    }
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.form_filters.patchValue(this.urlFiltersService.currentFilters);
  }

  paginate() {
    this.loading = true;
    let params = {
      company_id: this._userService.user.person.company_worked.id,
      ...this.pagination,
      ...this.form_filters.value,
    };
    this._consecutivo.paginate(params).subscribe((res: any) => {
      this.consecutivos = res.data.data;
      this.loading = false;
      this.pagination.length = res.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  openModal(content: any, item: any) {
    this.titulo_consecutivo = item.Tipo;
    this.id = item.Id_Comprobante_Consecutivo;
    this.consecutivo_numero = item.Consecutivo.toString().padStart(item.longitud, 0);
    this._modal.open(content);
    this.form = this.fb.group({
      Prefijo: [
        item.Prefijo,
        [Validators.required, Validators.minLength(2), Validators.maxLength(6)],
      ],
      longitud: [item.longitud, [Validators.required, Validators.pattern('^[0-9]*$')]],
      format_code: [item.format_code],
      Anio: [item.Anio, Validators.required],
      Mes: [item.Mes, Validators.required],
      Dia: [item.Dia, Validators.required],
      city: [item.city, Validators.required],
    });
    this.form.get('longitud')?.valueChanges.subscribe((r) => {
      this.consecutivo_numero = item.Consecutivo.toString().padStart(r, 0);
    });
  }

  saveConsecutivo() {
    if (!this.form.valid) {
      this._swal.incompleteError();
    } else {
      this._consecutivo.guardarConsecutivo(this.form.value, this.id).subscribe((r: any) => {
        this._swal.show({
          icon: 'success',
          title: 'Correcto',
          text: r.data,
          showCancel: false,
          timer: 1000,
        });
        this._modal.close();
        this.paginate();
      });
    }
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      type: '',
    });
    this.form_filters.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.paginate();
    });
  }
}

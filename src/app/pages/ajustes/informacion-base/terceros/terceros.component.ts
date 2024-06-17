import { Component, OnInit } from '@angular/core';
import { TercerosService } from './terceros.service';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, UpperCasePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { debounceTime } from 'rxjs/operators';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { SwalService } from '../services/swal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionEditComponent } from '../../../../shared/components/standard-components/action-edit/action-edit.component';
import { ActionButtonComponent } from '../../../../shared/components/standard-components/action-button/action-button.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { LoadImageComponent } from '../../../../shared/components/load-image/load-image.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { HeaderButtonComponent } from '../../../../shared/components/standard-components/header-button/header-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    RouterLink,
    HeaderButtonComponent,
    TableComponent,
    LoadImageComponent,
    NgClass,
    DropdownActionsComponent,
    ActionButtonComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    UpperCasePipe,
    LowerCasePipe,
    TitleCasePipe,
    CapitalLetterPipe,
  ],
})
export class TercerosComponent implements OnInit {
  selectedCampos = [];
  camposForm = new UntypedFormControl(this.selectedCampos);
  filtrosActivos: boolean = false;
  form_filters: UntypedFormGroup;
  loading: boolean = true;
  thirdParties: any[] = [];
  pagination = {
    page: 0,
    pageSize: 0,
    length: 0,
  };
  permission: Permissions = {
    menu: 'Terceros.',
    permissions: {
      show: true,
      add: true,
    },
  };
  paginationMaterial;
  listaCampos: any[] = [
    { value: 0, text: 'Foto', selected: true },
    { value: 2, text: 'Nombre', selected: true },
    { value: 1, text: 'Documento', selected: true },
    { value: 3, text: 'Dirección', selected: true },
    { value: 4, text: 'Ciudad', selected: true },
    { value: 5, text: 'Teléfono', selected: true },
    { value: 6, text: 'Tipo', selected: true },
    { value: 8, text: 'Correo electrónico', selected: false },
    { value: 7, text: 'Estado', selected: true },
  ];

  constructor(
    private _tercerosService: TercerosService,
    private fb: UntypedFormBuilder,
    public router: Router,
    private paginator: MatPaginatorIntl,
    private _swal: SwalService,
    private _permission: PermissionService,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.paginator.itemsPerPageLabel = 'Items por página:';
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.getUrlFilters();
      for (let i in this.listaCampos) {
        if (this.listaCampos[i].selected) {
          this.selectedCampos.push(this.listaCampos[i].value);
        }
      }
    } else {
      this.router.navigate(['/notauthorized']);
    }
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.form_filters.patchValue(this.urlFiltersService.currentFilters);
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      nit: '',
      name: '',
      third_party_type: '',
      email: '',
      cod_dian_address: '',
      municipio: '',
      phone: '',
    });
    this.form_filters.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.getThirdParties();
    });
  }

  cambiarCampo(event) {
    let position = event.source._keyManager._activeItemIndex;
    this.listaCampos[position].selected
      ? (this.listaCampos[position].selected = false)
      : (this.listaCampos[position].selected = true);
  }
  handlePageEvent() {
    localStorage.setItem('paginationItemsThirdParty', this.pagination.pageSize.toString());
    this.getThirdParties();
  }

  getThirdParties() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.form_filters.value,
    };
    this._tercerosService.getThirdParties(params).subscribe((r: any) => {
      this.loading = false;
      this.thirdParties = r.data.data;
      this.pagination.length = r.data.total;
      if (this.paginationMaterial?.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1;
        this.pagination.page = 1;
        this.getThirdParties();
      }
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  changeState(third, state) {
    let data = {
      id: third.id,
      state,
    };
    const request = (resolve: any) => {
      this._tercerosService.changeState(data).subscribe({
        next: (data: any) => {
          this.getThirdParties();
          resolve(true);
          this._swal.show({
            icon: 'success',
            title: 'Actualizado',
            text: 'El tercero ha sido actualizado con éxito.',
            showCancel: false,
            timer: 1000,
          });
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
          if (error.error.error) {
            errorMessage = error.error.error;
            this._swal.hardError();
          } else if (error.error.errors) {
            let errorMessages: string[] = [];
            for (const field in error.error.errors) {
              errorMessages.push(error.error.errors[field]);
            }
            const formattedErrorMessage = errorMessages.join('<br/>');
            this._swal.incompleteError(formattedErrorMessage);
          }
        },
      });
    };
    this._swal.swalLoading(
      `${data.state === 'Inactivo' ? '¡El Tercero se anulará!' : '¡El Tercero se activará!'}`,
      request,
    );
  }
}

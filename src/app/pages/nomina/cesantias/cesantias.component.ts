import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { CesantiasService } from './cesantias.service';
import { debounceTime } from 'rxjs/operators';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { PaginatorService } from 'src/app/services/paginator.service';

@Component({
  selector: 'app-cesantias',
  templateUrl: './cesantias.component.html',
  styleUrls: ['./cesantias.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    DecimalPipe,
    DatePipe,
    StandardModule,
    HeaderButtonComponent,
    ActionViewComponent,
  ],
})
export class CesantiasComponent implements OnInit {
  datePipe = new DatePipe('es-CO');
  severancePaymentValid: boolean = false;
  severanceInterestPaymentValid: boolean = false;
  severancePayments: any[] = [];
  loading: boolean = false;
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  permission: Permissions = {
    menu: 'Cesantías',
    permissions: {
      show: true,
      add: true,
    },
  };

  year = new Date().getFullYear();

  formFilters: UntypedFormGroup;
  orderObj: any;
  cesantiasList: any = [];

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private _permission: PermissionService,
    private _paginate: PaginatorService,
    private _cesantias: CesantiasService,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.getUrlFilters();
      this.validPay();
    } else {
      this.router.navigate(['/notauthorized']);
    }
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.formFilters.patchValue(this.urlFiltersService.currentFilters);
  }

  getSeverancePayments() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value,
    };
    this._cesantias.getSeverancePaymentsPaginate(params).subscribe((res: any) => {
      this.severancePayments = res.data.data;
      this.loading = false;
      this.pagination.length = res.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  setFiltros(page: any) {
    return this._paginate.SetFiltros(page, this.pagination, this.formFilters);
  }

  validPay() {
    const today = new Date();
    const startJanuary = new Date(today.getFullYear(), 0, 1).getTime();
    const endJanuary = new Date(today.getFullYear(), 0, 31).getTime();
    const endFebruary = new Date(today.getFullYear(), 1, 14).getTime();
    this.severancePaymentValid = startJanuary <= today.getTime() && today.getTime() <= endJanuary;
    this.severanceInterestPaymentValid =
      startJanuary <= today.getTime() && today.getTime() <= endFebruary;
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      people_id: [''],
      year: [''],
      type: [''],
    });
    this.formFilters.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.getSeverancePayments();
    });
  }

  redirect(type) {
    this.router.navigate(['/nomina/cesantias/', type, this.year]);
  }

  severanceView(item) {
    let type = item.type == 'Pago a fondo de cesantías' ? 'pago' : 'intereses';
    this.router.navigate(['/nomina/cesantias/ver', type, item.id]);
  }
}

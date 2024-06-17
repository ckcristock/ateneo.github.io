import { Component, OnInit, ViewChild } from '@angular/core';
import { SolicitudesCompraService } from './solicitudes-compra.service';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DatePipe, Location, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { setFilters } from '@shared/functions/url-filter.function';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionEditComponent } from '../../../shared/components/standard-components/action-edit/action-edit.component';
import { ActionViewComponent } from '../../../shared/components/standard-components/action-view/action-view.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { MatSelectModule } from '@angular/material/select';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-solicitudes-compra',
  templateUrl: './solicitudes-compra.component.html',
  styleUrls: ['./solicitudes-compra.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    RouterLink,
    TableComponent,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionEditComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    UpperCasePipe,
    DatePipe,
    StatusBadgeComponent,
  ],
})
export class SolicitudesCompraComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  solicitudesCompra: any[] = [];
  loading = false;
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  formFilters: FormGroup;
  active_filters: boolean = false;
  orderObj: any;
  datePipe = new DatePipe('es-CO');
  date: any;
  date2: any;
  solicitudesCotizadas: any;
  permission: Permissions = {
    menu: 'Solicitudes de compra',
    permissions: {
      show: true,
      add: true,
    },
  };

  rangeRequestForm = new FormGroup({
    start_created_at: new FormControl<Date | string | null>(null),
    end_created_at: new FormControl<Date | string | null>(null),
  });

  rangeForm = new FormGroup({
    start_expected_date: new FormControl<Date | string | null>(null),
    end_expected_date: new FormControl<Date | string | null>(null),
  });

  constructor(
    private _solicitudesCompra: SolicitudesCompraService,
    private _paginator: PaginatorService,
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private _permission: PermissionService,
    private route: ActivatedRoute,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.route.queryParamMap.subscribe((params: any) => {
        if (params.params.pageSize) {
          this.pagination.pageSize = params.params.pageSize;
        } else {
          this.pagination.pageSize = 10;
        }
        if (params.params.page) {
          this.pagination.page = params.params.page;
        } else {
          this.pagination.page = 1;
        }
        this.orderObj = { ...params.keys, ...params };
        if (Object.keys(this.orderObj).length > 3) {
          this.active_filters = true;
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.formFilters.patchValue(formValues['params']);
          this.rangeForm.patchValue(formValues['params']);
          this.rangeRequestForm.patchValue(formValues['params']);
        }
        this.getPurchaseRequest();
      });
    } else {
      this.router.navigate(['/notauthorized']);
    }
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    this.getPurchaseRequest();
  }

  resetFiltros() {
    this.date = '';
    this.date2 = '';
    this._paginator.resetFiltros(this.formFilters);
    this.active_filters = false;
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      status: '',
      code: '',
      // work_order_id: '',
      start_created_at: '',
      end_created_at: '',
      start_expected_date: '',
      end_expected_date: '',
    });
    this.formFilters.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.getPurchaseRequest();
    });
  }

  getPurchaseRequest() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value,
    };
    this._solicitudesCompra.getPurchaseRequest(params).subscribe((res: any) => {
      this.solicitudesCompra = res.data.data;

      this.loading = false;
      this.pagination.length = res.data.total;
    });
    const paramsurl = setFilters(params);
    this.location.replaceState('/compras/solicitud', paramsurl.toString());
  }

  count(solicitud) {
    let cont = 0;
    if (
      solicitud.product_purchase_request.length > 0 &&
      solicitud.quotation_purchase_request.length == 0
    ) {
      solicitud.product_purchase_request.forEach((productPurchase) => {
        if (productPurchase.quotation.length > 0) {
          cont++;
        }
      });
      return cont;
    } else if (solicitud.quotation_purchase_request.length > 0) {
      cont = solicitud.product_purchase_request.length;
      return cont;
    }
  }

  selectedDate(type_date) {
    if (type_date == 'created_at') {
      const { end_created_at, start_created_at } = this.rangeRequestForm.value as any;
      if (end_created_at && start_created_at) {
        this.formFilters.patchValue({
          start_created_at: this.datePipe.transform(start_created_at._d, 'yyyy-MM-dd'),
          end_created_at: this.datePipe.transform(end_created_at._d, 'yyyy-MM-dd'),
        });
      } else {
        this.formFilters.patchValue({
          start_created_at: '',
          end_created_at: '',
        });
      }
    } else if (type_date == 'expected_date') {
      const { end_expected_date, start_expected_date } = this.rangeForm.value as any;
      if (end_expected_date && start_expected_date) {
        this.formFilters.patchValue({
          start_expected_date: this.datePipe.transform(start_expected_date._d, 'yyyy-MM-dd'),
          end_expected_date: this.datePipe.transform(end_expected_date._d, 'yyyy-MM-dd'),
        });
      } else {
        this.formFilters.patchValue({
          start_expected_date: '',
          end_expected_date: '',
        });
      }
    }
  }
}

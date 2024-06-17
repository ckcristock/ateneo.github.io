import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

import { ReturnPurchasesService } from '../../return-purchases.service';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { CommonModule } from '@angular/common';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { downloadFile } from '@shared/functions/download-pdf.function';

@Component({
  selector: 'app-return-made',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    CardComponent,
    TableComponent,
    LoadImageComponent,
    DropdownActionsComponent,
    CommonModule,
    ActionViewComponent,
    ActionButtonComponent,
    ActionDeactivateComponent,
    StatusBadgeComponent,
    AutomaticSearchComponent,
    DatePickerComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './return-made.component.html',
  styleUrl: './return-made.component.scss',
})
export class ReturnMadeComponent implements OnInit {
  readonly RUTA = environment.base_url;

  purchases = [];

  filters = {
    cod: '',
    fecha: '',
    prov: '',
    estado: '',
  };

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  loading = false;

  userId = 0;

  indexLoading = -1;

  constructor(
    private readonly returnPurchasesService: ReturnPurchasesService,
    private readonly userService: UserService,
    private readonly swalService: SwalService,
  ) {
    this.userId = Number(this.userService.user.id);
  }

  ngOnInit(): void {
    this.getReturnMade();
  }

  getReturnMade(): void {
    this.loading = true;
    const params = {
      ...this.pagination,
      ...this.filters,
    };
    this.returnPurchasesService.getReturnMade(params).subscribe({
      next: (res) => {
        this.purchases = res.data.data;
        this.pagination.length = res.data.total;
        this.loading = false;
      },
    });
  }

  onFilters(key: string, value: string): void {
    this.filters[key] = value;
    this.getReturnMade();
  }

  selectedDate(dates: DatePicker) {
    this.filters = {
      ...this.filters,
      fecha: dates.start_date ? `${dates.start_date} - ${dates.end_date}` : '',
    };
    this.getReturnMade();
  }

  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = pageObject.pageIndex + 1 || 1;
    this.pagination.pageSize = pageObject.pageSize || 10;
    this.getReturnMade();
  }

  postPrintReturnMade(index: number, item: any) {
    const params = {
      tipo: 'Devolucion_Compra',
      id: item.Id_Devolucion_Compra,
    };
    this.indexLoading = index;
    this.returnPurchasesService.postPrintReturnMade(params).subscribe({
      next: (file: any) => {
        downloadFile({ name: `noConforme`, file });
        this.indexLoading = -1;
      },
    });
  }

  async cancelReturn(id: number): Promise<void> {
    const body = new FormData();
    body.append('id', String(id));
    body.append('funcionario', String(this.userId));
    try {
      await this.swalService.confirm('Se dispone a anular esta devolución', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.returnPurchasesService.cancelReturn(body).subscribe({
              next: (res) => {
                this.swalService.show({
                  icon: 'success',
                  title: 'Devoluciones',
                  showCancel: false,
                  text: res.mensaje,
                  timer: 1000,
                });
                this.getReturnMade();
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
      this.swalService.hardError();
    }
  }
}

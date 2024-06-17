import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ApprovedReceivingService } from './approved-receiving.service';
import { UserService } from 'src/app/core/services/user.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-approved-receiving-minutes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatPaginatorModule,
    NgbDropdownModule,
    CardComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    LoadImageComponent,
    AutomaticSearchComponent,
    DatePickerComponent,
  ],
  templateUrl: './approved-receiving-minutes.component.html',
  styleUrl: './approved-receiving-minutes.component.scss',
})
export class ApprovedReceivingMinutesComponent implements OnInit {
  records = [];

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  filters = {
    cod: '',
    fecha: '',
    fecha2: '',
    fact: '',
    proveedor: '',
    compra: '',
  };

  companyId = 0;

  loading = false;

  constructor(
    private readonly approvedReceivingService: ApprovedReceivingService,
    private readonly userService: UserService,
  ) {
    this.companyId = userService.user.person.company_worked.id;
  }

  ngOnInit(): void {
    this.getApprovedReceivingMinutes();
  }

  getApprovedReceivingMinutes(): void {
    this.loading = true;
    const params = {
      pag: this.pagination.page,
      estado: 'Aprobada',
      id_funcionario: '1',
      company_id: this.companyId,
      ...this.filters,
    };
    this.approvedReceivingService.getApprovedReceivingMinutes(params).subscribe({
      next: (res) => {
        this.records = res.data.data;
        this.pagination.length = res.data.total;
        this.loading = false;
      },
    });
  }

  onFilters(key: string, value: string): void {
    this.filters[key] = value;
    this.getApprovedReceivingMinutes();
  }

  selectedDate(dates: DatePicker, isPurchase?: Boolean) {
    this.filters = {
      ...this.filters,
      [isPurchase ? 'fecha2' : 'fecha1']: dates.start_date
        ? `${dates.start_date} - ${dates.end_date}`
        : '',
    };
    this.getApprovedReceivingMinutes();
  }
}

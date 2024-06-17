import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

import { ReturnPurchasesService } from '../../return-purchases.service';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatePurchaseOrderComponent } from './components/create-purchase-order/create-purchase-order.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { HeaderDownloadComponent } from '@shared/components/standard-components/header-download/header-download.component';

@Component({
  selector: 'app-pending-return',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    CommonModule,
    TableComponent,
    LoadImageComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    AutomaticSearchComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './pending-return.component.html',
  styleUrl: './pending-return.component.scss',
})
export class PendingReturnComponent implements OnInit {
  RUTA = environment.ruta;

  purchases = [];

  filters = {
    cod: '',
    fecha: '',
    prov: '',
  };

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  loading = false;

  constructor(
    private readonly returnPurchasesService: ReturnPurchasesService,
    private readonly modalService: NgbModal,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getReturnPending();
  }

  getReturnPending(): void {
    this.loading = true;
    const params = {
      ...this.pagination,
      ...this.filters,
    };
    this.returnPurchasesService.getReturnPending(params).subscribe({
      next: (res) => {
        this.purchases = res.data.data;
        this.pagination.length = res.data.total;
        this.loading = false;
      },
    });
  }

  onFilters(key: string, value: string): void {
    this.filters[key] = value;
    this.getReturnPending();
  }

  openCreatePurchaseOrder(id: number, idNonconforming: number): void {
    const modalRef = this.modalService.open(CreatePurchaseOrderComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.idNonconforming = idNonconforming;
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'generate-order') this.getReturnPending();
      },
    });
  }

  async closeNonConforming(id: number): Promise<void> {
    try {
      await this.swalService.confirm('Se dispone a cerrar la no conformidad', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.returnPurchasesService.closeNonConforming({ id }).subscribe({
              next: (res) => {
                this.swalService.show({
                  icon: 'success',
                  title: '¡Exitoso!',
                  showCancel: false,
                  text: 'No conforme cerrado satisfactoriamente',
                  timer: 1000,
                });
                this.getReturnPending();
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

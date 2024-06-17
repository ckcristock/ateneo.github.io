import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EpssService } from '../../services/epss.service';
import { SwalService } from '../../services/swal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-list-contracts',
  templateUrl: './list-contracts.component.html',
  styleUrls: ['./list-contracts.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    RouterLink,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    StatusBadgeComponent,
  ],
})
export class ListContractsComponent implements OnInit {
  contracts: any[] = [];
  loading: boolean = false;
  filtros: any = {
    name: '',
    code: '',
  };

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  constructor(
    private epsContractService: EpssService,
    private _swal: SwalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getAllContratos();
    this.getUrlFilters();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
  }

  getAllContratos() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };

    this.loading = true;
    this.epsContractService.getAllPaginateEpsContact(params).subscribe((res: any) => {
      this.loading = false;
      this.contracts = res.data.data;
      this.pagination.length = res.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  anularOActivar(zone, status, state) {
    let data = { id: zone.id, status, state };
    const text = 'El contrato';
    const request = () => {
      this.epsContractService.createNewEpsContact(data).subscribe((res) => {
        this.getAllContratos();
        this._swal.activateOrInactivateSwalResponse(state, text);
      });
    };
    this._swal.activateOrInactivateSwal(state, text, request);
  }
}

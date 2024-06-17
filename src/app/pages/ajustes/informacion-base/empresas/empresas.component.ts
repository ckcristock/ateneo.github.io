import { Component, OnInit } from '@angular/core';
import { ConfiguracionEmpresaService } from './company-configuration/configuracion-empresa.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutomaticSearchComponent } from '../../../../shared/components/automatic-search/automatic-search.component';
import { ActionButtonComponent } from '../../../../shared/components/standard-components/action-button/action-button.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { NgClass, UpperCasePipe, DecimalPipe } from '@angular/common';
import { LoadImageComponent } from '../../../../shared/components/load-image/load-image.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    TableComponent,
    LoadImageComponent,
    NgClass,
    DropdownActionsComponent,
    ActionButtonComponent,
    AutomaticSearchComponent,
    UpperCasePipe,
    DecimalPipe,
    StatusBadgeComponent,
  ],
})
export class EmpresasComponent implements OnInit {
  pagination = {
    page: 1,
    pageSize: 50,
    length: 0,
  };
  filtro: any = {
    name: '',
    tin: '',
  };
  permission: Permissions = {
    menu: 'Empresas',
    permissions: {
      show: true,
      all_companies: true,
    },
  };
  loading: boolean = false;
  enterprises: any[] = [];
  constructor(
    private _company: ConfiguracionEmpresaService,
    private _permission: PermissionService,
    public router: Router,
    private _user: UserService,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.all_companies) {
      this.getCompany();
      this.getUrlFilters();
    } else {
      const worked_id = this._user?.user?.person?.company_worked?.id;
      this.router.navigate([
        `/ajustes/configuracion/configuracion-empresa/${worked_id}/informacion`,
      ]);
    }
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtro = this.urlFiltersService.currentFilters;
  }

  getCompany(): void {
    const params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._company.getCompanies(params).subscribe((res: any) => {
      this.enterprises = res.data.data;
      this.loading = false;
      this.pagination.length = res.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }
}

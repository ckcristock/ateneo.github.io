import { Component, OnInit } from '@angular/core';
import { NgClass, UpperCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';

import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { HeaderDownloadComponent } from '@shared/components/standard-components/header-download/header-download.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { Person } from 'src/app/core/models/person.model';
import { UserService } from 'src/app/core/services/user.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { Responses } from 'src/app/core/interfaces/responses';
import { ResponsesPaginate } from 'src/app/core/interfaces/responses-paginate';
import { PersonService } from '../professionals/profesionales.service';
import { DependenciesService } from '../services/dependencies.service';
import { CompanyService } from '../services/company.service';
import { SwalService } from '../services/swal.service';
import { LoadImageComponent } from '../../../../shared/components/load-image/load-image.component';
import { AutomaticSearchComponent } from '../../../../shared/components/automatic-search/automatic-search.component';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
  standalone: true,
  imports: [
    AutomaticSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatRadioModule,
    RouterLink,
    LoadImageComponent,
    NgClass,
    MatPaginatorModule,
    NotDataComponent,
    UpperCasePipe,
    CardComponent,
    AddButtonComponent,
    HeaderDownloadComponent,
  ],
})
export class FuncionariosComponent implements OnInit {
  public dependencies!: any[];

  public companies!: any[];

  loading!: boolean;

  formFilters!: UntypedFormGroup;

  people!: Person[];

  donwloading!: boolean;

  currentCompany!: number | undefined;

  status: { id: string | number; name: string }[] = [
    { id: '', name: 'Todos' },
    { id: 1, name: 'Activo' },
    { id: 2, name: 'Inactivo' },
    { id: 3, name: 'Liquidado' },
    { id: 4, name: 'Preliquidado' },
  ];

  pagination = {
    pageSize: 20,
    page: 1,
    total: 0,
    per_page: '',
    current_page: 0,
  };

  permission: Permissions = {
    menu: 'Funcionarios',
    permissions: {
      show: true,
      all_companies: true,
      add: true,
      edit: true,
    },
  };

  loadingCompany = true;

  constructor(
    private readonly personService: PersonService,
    private readonly dependenciesService: DependenciesService,
    private readonly companiesService: CompanyService,
    private readonly swalService: SwalService,
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly paginatorService: PaginatorService,
    private readonly fb: UntypedFormBuilder,
    public router: Router,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.permission = permissionService.validatePermissions(this.permission);
    this.currentCompany = userService?.user?.person?.company_worked?.id;
  }

  async ngOnInit(): Promise<void> {
    this.createFormFilters();
    if (this.permission.permissions.show) {
      this.loading = true;
      this.getUrlFilters();
      await this.getCompanies();
      this.getPeople();
    } else {
      this.router.navigate(['/notautorized']);
    }
  }

  private getUrlFilters(): void {
    this.pagination = { ...this.pagination, ...this.urlFiltersService.currentPagination };
    this.formFilters.patchValue(this.urlFiltersService.currentFilters);
  }

  createFormFilters(): void {
    this.formFilters = this.fb?.group({
      company_id: '',
      status: '',
      dependency_id: '',
      name: '',
    });
    if (!this.permission?.permissions?.all_companies) {
      this.formFilters.patchValue({
        company_id: this.currentCompany,
      });
      this.getPeople();
    }
  }

  private async getCompanies(): Promise<void> {
    const params = { owner: 1 };
    await this.companiesService
      .getCompanies(params)
      .toPromise()
      .then((r: Responses) => {
        this.companies = r.data;
        this.companies.unshift({ text: 'Todos', value: '' });
        this.getDependencies();
      });
  }

  handlePageEvent(event: PageEvent): void {
    this.paginatorService?.handlePageEvent(event, this.pagination);
    this.getPeople();
  }

  onSearchName(name: string) {
    this.formFilters.patchValue({
      name,
    });
    this.getPeople();
  }

  onFilters(key: string, value: string) {
    this.formFilters.patchValue({
      [key]: value,
    });
    this.getPeople();
  }

  getPeople(): void {
    this.loading = true;
    const params: any = {
      ...this.pagination,
      ...this.formFilters.value,
    };
    this.personService.getPeople(params).subscribe((d: ResponsesPaginate) => {
      this.people = d.data.data;
      const { per_page, current_page, total } = d.data;
      this.pagination.per_page = per_page;
      this.pagination.current_page = current_page;
      this.pagination.total = total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  companySelected(): void {
    this.getPeople();
    this.getDependencies();
  }

  getDependencies(panel?: MatExpansionPanel): void {
    if (panel) panel.close();
    this.loadingCompany = true;
    this.dependenciesService
      .getDependencies({ company_id: this.formFilters?.get('company_id')?.value || '' })
      .subscribe((r: Responses) => {
        this.loadingCompany = false;
        this.dependencies = r.data;
        this.dependencies.unshift({ value: '', text: 'Todas' });
      });
  }

  setFilters(paginacion: number): HttpParams {
    return this.paginatorService?.SetFiltros(paginacion, this.pagination, this.formFilters);
  }

  download(): void {
    this.donwloading = true;
    this.personService?.download()?.subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/excel' });
        const link = document?.createElement('a');
        const filename = 'lista_de_funcionarios';
        link.href = window?.URL?.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link?.click();
        this.donwloading = false;
      },
      error: () => {
        this.donwloading = false;
        this.swalService.hardError();
      },
      complete: () => {
        this.donwloading = false;
      },
    });
  }
}

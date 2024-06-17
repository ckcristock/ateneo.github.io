import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, Location, NgClass, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatExpansionModule } from '@angular/material/expansion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { GlobalService } from '@shared/services/global.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { DisciplinariosService } from './disciplinarios.service';
import { CallReleasesComponent } from './components/call-releases/call-releases.component';
import { AddCausesComponent } from './components/add-causes/add-causes.component';
import { CloseProcessComponent } from './components/close-process/close-process.component';

import { consts } from '../../../../core/utils/consts';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { AddActionTypeComponent } from './components/add-action-type/add-action-type.component';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ProcessModule } from '../process.module';

@Component({
  selector: 'app-disciplinarios',
  standalone: true,
  imports: [
    MatExpansionModule,
    RouterLink,
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    HeaderButtonComponent,
    ActionButtonComponent,
    NgClass,
    ViewMoreComponent,
    DatePipe,
    UpperCasePipe,
    AsyncPipe,
    ProcessModule,
  ],
  templateUrl: './disciplinarios.component.html',
  styleUrls: ['./disciplinarios.component.scss'],
})
export class DisciplinariosComponent implements OnInit {
  readonly permission: Permissions = {
    menu: 'Disciplinarios',
    permissions: {
      approve: false,
    },
  };

  readonly status = consts.status;

  people$ = new Observable();

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  filtros: any = {
    person: '',
    status: '',
    code: '',
    involved: '',
  };

  process: any[] = [];

  collapsed: boolean[] = [];

  loadingDownload = 0;

  loading = false;

  activeFilters = false;

  constructor(
    private readonly disciplinarioService: DisciplinariosService,
    private readonly swal: SwalService,
    private readonly permissionService: PermissionService,
    private readonly globalService: GlobalService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly modalService: NgbModal,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.permission = permissionService.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    this.getUrlFilters();
    this.people$ = this.globalService.getAllPeople$;
    this.getDisciplinaryProcess();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
  }

  getDisciplinaryProcess() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this.disciplinarioService.getDisciplinaryProcess(params).subscribe((res: any) => {
      this.process = res.data.data;
      this.loading = false;
      this.pagination.length = res.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  aprobar(id) {
    this.swal
      .show({
        title: '¿Estás seguro(a)?',
        text: '¡El proceso será aprobado!',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.disciplinarioService.approve({ status: 'Aprobado' }, id).subscribe((r: any) => {
            this.swal.show({
              icon: 'success',
              title: 'El proceso ha sido aprobado!',
              text: '¡Aprobado!',
              timer: 1000,
              showCancel: false,
            });
            this.getDisciplinaryProcess();
          });
        }
      });
  }

  openCallReleases(id: number, type?: string): void {
    const modalRef = this.modalService.open(CallReleasesComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.typeReleases = type;
  }

  openAddCauses(): void {
    this.modalService.open(AddCausesComponent);
  }

  openAddActionType(): void {
    this.modalService.open(AddActionTypeComponent);
  }

  openProcessClosed(id: number): void {
    const modalRef = this.modalService.open(CloseProcessComponent, { centered: true });
    modalRef.componentInstance.id = id;
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'closed') this.getDisciplinaryProcess();
      },
    });
  }

  downloadVer(id) {
    this.disciplinarioService.downloadPDF(id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'descargo-ver';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.loading = false;
    }),
      (error) => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      };
  }

  download(file, id: number) {
    this.loadingDownload = id;
    this.disciplinarioService.download(file).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = file;
      link.click();
      this.loadingDownload = 0;
    }),
      (error) => {
        this.loadingDownload = 0;
      },
      () => {
        this.loadingDownload = 0;
      };
  }
}

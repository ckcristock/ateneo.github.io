import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { downloadFile } from '@shared/functions/download-pdf.function';
import { MemorandosService } from './memorandos.service';
import { MemorandumReasonComponent } from './components/memorandum-reason/memorandum-reason.component';
import { CreateMemorandumComponent } from './components/create-memorandum/create-memorandum.component';

import { ProcessHeaderComponent } from '../components/process-header/process-header.component';
import { Permissions } from '../../../../core/interfaces/permissions-interface';
import { PermissionService } from '../../../../core/services/permission.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { ListFilesComponent } from '../components/list-files/list-files.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-memorandos',
  standalone: true,
  imports: [
    ProcessHeaderComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    RouterLink,
    LoadImageComponent,
    ViewMoreComponent,
    TitleCasePipe,
    DatePipe,
    UpperCasePipe,
  ],
  templateUrl: './memorandos.component.html',
  styleUrls: ['./memorandos.component.scss'],
})
export class MemorandosComponent implements OnInit {
  private permission: Permissions = {
    menu: 'Memorandos',
    permissions: {
      approve: true,
    },
  };

  people = [];

  allPeople = [];

  memorandums = [];

  filters = {};

  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  loadingDownload = 0;

  loading = false;

  constructor(
    private memorandosService: MemorandosService,
    private _permission: PermissionService,
    private modalService: NgbModal,
    private _swal: SwalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    this.getUrlFilters();
    this.getMemorandum();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  getMemorandum() {
    const params = {
      ...this.filters,
      ...this.pagination,
    };
    this.loading = true;
    this.memorandosService.getMemorandumList(params).subscribe({
      next: (res) => {
        const response = res['data'];
        this.memorandums = response['data'];
        this.pagination.length = response['total'];
        this.loading = false;
      },
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  downloadMemorandum(id: number) {
    this.loadingDownload = id;
    this.memorandosService.downloadMemorandum(id).subscribe({
      next: (file: BlobPart) => {
        downloadFile({ name: `memorando_${id}`, file });
        this.loadingDownload = 0;
      },
      error: () => {
        this.loadingDownload = 0;
      },
    });
  }

  openAddReason(): void {
    this.modalService.open(MemorandumReasonComponent);
  }

  openListFiles(list: any[]): void {
    const modalRef = this.modalService.open(ListFilesComponent, { centered: true });
    modalRef.componentInstance.listFiles = list;
    modalRef.componentInstance.isRemove = false;
  }

  openAddMemorandum(): void {
    const modalRef = this.modalService.open(CreateMemorandumComponent);
    modalRef.componentInstance.people = this.people;
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'request-memorandum') this.getMemorandum();
      },
    });
  }

  aprobarMemorando(memorando, state) {
    let data = {
      id: memorando.id,
      state,
    };
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: '¡El memorando será aprobado!',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.memorandosService.createNewMemorandum(data).subscribe((r: any) => {
            this._swal.show({
              icon: 'success',
              text: '¡El memorando ha sido aprobado!',
              title: '¡Aprobado!',
              timer: 1000,
              showCancel: false,
            });
            this.getMemorandum();
          });
        }
      });
  }
}

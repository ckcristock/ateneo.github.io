import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';

import { MultiFilesComponent } from '@shared/components/multi-files/multi-files.component';
import { Activity, ActivityComponent } from '@shared/components/activity/activity.component';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';

import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { TableInvolvedComponent } from './components/table-involved/table-involved.component';
import { DisciplinaryFollow } from './disciplinary-follow.interface';
import { DescargoService } from '../../descargo.service';
import { DisciplinaryActionsComponent } from './components/disciplinary-actions/disciplinary-actions.component';
import { CloseProcessComponent } from '../close-process/close-process.component';
import { CallReleasesComponent } from '../call-releases/call-releases.component';
import { ListFilesComponent } from '../../../components/list-files/list-files.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { CabeceraComponent } from 'src/app/components/cabecera/cabecera.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-disciplinary-follow',
  standalone: true,
  imports: [
    CommonModule,
    ActivityComponent,
    TableInvolvedComponent,
    ListFilesComponent,
    ViewMoreComponent,
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    NotDataComponent,
    CabeceraComponent,
  ],
  templateUrl: './disciplinary-follow.component.html',
  styleUrl: './disciplinary-follow.component.scss',
})
export class DisciplinaryFollowComponent implements OnInit {
  permission: Permissions = {
    menu: 'Disciplinarios',
    permissions: {
      close: false,
      open: false,
    },
  };

  historyData: Activity[] = [];

  process!: DisciplinaryFollow;

  headerData: any = {
    Titulo: '',
    Fecha: new Date(),
  };

  id = 0;

  isClosed = false;

  loading = true;

  constructor(
    private readonly permissionService: PermissionService,
    private readonly descargoService: DescargoService,
    private readonly activatedRouter: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly swalService: SwalService,
  ) {
    this.permission = permissionService.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    this.id = +this.activatedRouter.snapshot.paramMap.get('id');
    this.getDisciplinaryProcess();
  }

  getDisciplinaryProcess() {
    this.loading = true;
    this.descargoService.getDisciplinaryProcessById(this.id).subscribe({
      next: (res) => {
        this.historyData = res.data.history.map((res) => ({
          date: String(res.created_at),
          description: res.description,
          full_name: res.user.person_image_name.full_names,
          image: res.user.person_image_name.image,
          title: res.title,
        }));
        this.process = res.data;
        this.isClosed = this.process.status === 'Cerrado';
        this.setHeaderData();
        this.loading = false;
      },
    });
  }

  private setHeaderData(): void {
    this.headerData.Fecha = this.process.date_of_admission;
    this.headerData.Codigo = this.process.code;
    this.headerData.Titulo = this.process.title;
  }

  openMultiFiles(): void {
    const modalRef = this.modalService.open(MultiFilesComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.sendFiles.subscribe({
      next: (files: File[]) => {
        this.saveFiles(files);
      },
    });
  }

  openDisciplinaryActions(): void {
    const modalRef = this.modalService.open(DisciplinaryActionsComponent, { centered: true });
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.newRequest.subscribe({
      next: () => {
        this.getDisciplinaryProcess();
      },
    });
  }

  openProcessClosed(): void {
    const modalRef = this.modalService.open(CloseProcessComponent, { centered: true });
    modalRef.componentInstance.id = this.id;
  }

  openCallReleases(id: number): void {
    const modalRef = this.modalService.open(CallReleasesComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.typeReleases = 'personal';
  }

  private async saveFiles(files: File[]): Promise<void> {
    const body: any[] = [...files];
    body.forEach((file) => {
      file.disciplinary_process_id = this.id;
      file.motivo = '';
    });
    try {
      await this.swalService.confirm('Se agregarán los documentos seleccionados', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.modalService.dismissAll();
            this.descargoService.saveFiles(body).subscribe({
              next: () => {
                this.getDisciplinaryProcess();
                this.swalService.show({
                  icon: 'success',
                  title: 'Guardado correctamente',
                  text: 'Los documentos han sido guardados correctamente',
                  showCancel: false,
                  timer: 1000,
                });
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

  async deleteDocument(id: number): Promise<void> {
    try {
      await this.swalService.confirm('Se eliminará el documento seleccionado', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.descargoService.deleteDocuments({ state: 'Inactivo' }, id).subscribe({
              next: () => {
                this.swalService.show({
                  icon: 'success',
                  title: '¡Documento eliminado!',
                  showCancel: false,
                  text: 'Documento eliminado del proceso satisfactoriamente',
                  timer: 1000,
                });
                this.getDisciplinaryProcess();
                resolve(true);
              },
              error: () => {
                resolve(false);
              },
            });
            this.modalService.dismissAll();
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this.swalService.hardError();
    }
  }
}

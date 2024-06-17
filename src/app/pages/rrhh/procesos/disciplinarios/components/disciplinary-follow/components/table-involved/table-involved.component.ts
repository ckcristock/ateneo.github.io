import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';

import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { DisciplinaryPersonInvolved } from '../../disciplinary-follow.interface';
import { AddInvolveddisciplinaryComponent } from '../../../add-involved-disciplinary/add-involved-disciplinary.component';
import { DescargoService } from '../../../../descargo.service';
import { CallReleasesComponent } from '../../../call-releases/call-releases.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';

@Component({
  selector: 'app-table-involved',
  standalone: true,
  imports: [
    CommonModule,
    ViewMoreComponent,
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    ActionDeactivateComponent,
    LoadImageComponent,
  ],
  templateUrl: './table-involved.component.html',
  styleUrl: './table-involved.component.scss',
})
export class TableInvolvedComponent implements OnInit {
  @Input() isClosed = false;

  @Input() id = 0;

  @Input() involedList: DisciplinaryPersonInvolved[] = [];

  @Output() refresh = new EventEmitter();

  involvedForm = new FormArray([]);

  collapsed = [];

  constructor(
    private readonly modalService: NgbModal,
    private readonly descargoService: DescargoService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.subscribeInvolvedList();
  }

  private subscribeInvolvedList(): void {
    this.involvedForm.valueChanges.subscribe({
      next: () => {
        this.addInvolved();
      },
    });
  }

  openAddInvolvedDisciplinary(): void {
    const modalRef = this.modalService.open(AddInvolveddisciplinaryComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.formArray = this.involvedForm;
  }

  openCallReleases(id: number): void {
    const modalRef = this.modalService.open(CallReleasesComponent, { size: 'lg' });
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.typeReleases = 'tercero';
    modalRef.componentInstance.involvedId = id;
  }

  private async addInvolved(): Promise<void> {
    const body = this.involvedForm.value[0];
    body.disciplinary_process_id = this.id;
    try {
      await this.swalService.confirm('Se agregará el involucrado', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.descargoService.createAnotacion(body).subscribe({
              next: () => {
                this.swalService.show({
                  icon: 'success',
                  title: 'Operación exitosa',
                  showCancel: false,
                  text: 'Anulado con éxito',
                  timer: 1000,
                });
                this.refresh.emit();
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

  removeInvolved(id: number) {
    this.swalService
      .customAlert({
        input: 'textarea',
        inputLabel: '¡El involucrado será anulado del proceso!',
        inputPlaceholder: 'Ingresa el motivo',
        showCancelButton: true,
      })
      .then((res) => {
        const request = () => {
          this.descargoService
            .cancelAnnotation(id, { state: 'Inactivo', reason: res.value })
            .subscribe({
              next: () => {
                this.swalService.show({
                  icon: 'success',
                  title: 'Operación exitosa',
                  showCancel: false,
                  text: 'Anulado con éxito',
                  timer: 3000,
                });
                this.refresh.emit();
              },
            });
        };
        if (res.isConfirmed) this.swalService.swalLoading(`Confirmar anulación`, request);
      });
  }
}

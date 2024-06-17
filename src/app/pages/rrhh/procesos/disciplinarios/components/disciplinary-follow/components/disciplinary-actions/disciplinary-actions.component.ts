import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { loadFile } from '@shared/functions/load-file';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

import { DescargoService } from '../../../../descargo.service';
import { ActionTypeService } from '../../../add-action-type/action-type.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-disciplinary-actions',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    TextFieldModule,
  ],
  templateUrl: './disciplinary-actions.component.html',
  styleUrl: './disciplinary-actions.component.scss',
})
export class DisciplinaryActionsComponent implements OnInit {
  @Input() id = 0;

  @Output() newRequest = new EventEmitter();

  private datePipe = new DatePipe('es-CO');

  formActions = new FormGroup({
    description: new FormControl('', [Validators.required]),
    action_type_id: new FormControl({ value: '', disabled: true }, [Validators.required]),
    date: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    file: new FormControl(null),
  });

  actionTypes = [];

  loadFile = false;

  loadingActions = true;

  constructor(
    private readonly swalService: SwalService,
    private readonly descargoService: DescargoService,
    private readonly actionTypeService: ActionTypeService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getActionTypes();
  }

  private getActionTypes(): void {
    this.actionTypeService.getActionType().subscribe({
      next: (res) => {
        this.actionTypes = res.data;
        this.loadingActions = false;
        this.formActions.get('action_type_id').enable();
      },
    });
  }

  onFileChanged(event): void {
    const file = event.target.files[0];
    loadFile(file)
      .then((res) => {
        this.formActions.get('file').setValue(res.file);
        this.loadFile = true;
      })
      .catch(() => {
        this.swalService.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
      });
  }

  async newAction(): Promise<void> {
    const body = {
      ...this.formActions.value,
      disciplinary_process_id: this.id,
    };
    try {
      await this.swalService.confirm('Se agregará una nueva actuación', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.modalService.dismissAll();
            this.descargoService.newProcessAction(body).subscribe({
              next: () => {
                this.swalService.show({
                  icon: 'success',
                  title: 'Guardado correctamente',
                  text: 'La actuación ha sido guardado correctamente',
                  showCancel: false,
                  timer: 1000,
                });
                resolve(true);
                this.newRequest.emit();
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

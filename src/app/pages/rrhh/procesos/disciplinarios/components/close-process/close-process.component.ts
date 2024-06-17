import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { loadFile } from '@shared/functions/load-file';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { DisciplinariosService } from '../../disciplinarios.service';

import { CerrarProcesoService } from '../../cerrar-proceso.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-close-process',
  standalone: true,
  imports: [
    ModalComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    TextFieldModule,
    NotDataComponent,
  ],
  templateUrl: './close-process.component.html',
  styleUrl: './close-process.component.scss',
})
export class CloseProcessComponent implements OnInit {
  @Input() id = 0;

  formClose = new FormGroup({
    disciplinary_closure_reasons_id: new FormControl(null, [Validators.required]),
    file: new FormControl(null),
    description: new FormControl('', [Validators.required]),
  });

  causes = [];

  loading = false;

  loadFile = false;

  constructor(
    private readonly disciplinaryService: DisciplinariosService,
    private readonly cerrarProcesoService: CerrarProcesoService,
    private readonly swalService: SwalService,
    private readonly router: Router,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getCauses();
  }

  private getCauses(): void {
    this.loading = true;
    this.disciplinaryService.getClosureReason().subscribe({
      next: (res) => {
        this.loading = false;
        this.causes = res.data;
      },
    });
  }

  onFileChanged(event): void {
    const file = event.target.files[0];
    loadFile(file)
      .then((res) => {
        this.formClose.get('file').setValue(res.file);
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

  async closeProcess(): Promise<void> {
    const body = {
      ...this.formClose.value,
      disciplinary_process_id: this.id,
    };
    try {
      await this.swalService.confirm(
        'Si cierras el proceso se cambiará el estado a cerrado y no se permitirán más cambios',
        {
          preConfirm: () => {
            return new Promise((resolve) => {
              this.cerrarProcesoService.cerrarProceso(body).subscribe({
                next: () => {
                  this.modalService.dismissAll('closed');
                  this.router.navigate(['/rrhh/procesos/disciplinarios']);
                  this.swalService.show({
                    icon: 'success',
                    title: 'Cerrado correctamente',
                    showCancel: false,
                    text: '',
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
        },
      );
    } catch (error) {
      this.swalService.hardError();
    }
  }
}

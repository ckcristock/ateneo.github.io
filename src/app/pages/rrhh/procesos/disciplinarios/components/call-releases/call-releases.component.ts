import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { downloadFile } from '@shared/functions/download-pdf.function';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Texteditor2Service } from 'src/app/pages/ajustes/informacion-base/services/texteditor2.service';

import { DisciplinariosService } from '../../disciplinarios.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-call-releases',
  standalone: true,
  imports: [CKEditorModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './call-releases.component.html',
  styleUrl: './call-releases.component.scss',
})
export class CallReleasesComponent {
  @Input() id = 0;

  @Input() involvedId = 0;

  @Input() typeReleases = '';

  editorControl = new FormControl();

  constructor(
    public texteditor: Texteditor2Service,
    private readonly disciplinarioService: DisciplinariosService,
    private readonly modalService: NgbModal,
    private readonly swalService: SwalService,
  ) {}

  async onDownload(): Promise<void> {
    const params: any = {
      content: this.editorControl.value,
    };
    if (this.typeReleases) params.type = this.typeReleases;
    if (this.involvedId) params.involved_id = this.involvedId;
    try {
      await this.swalService.confirm('Se descargará el documento con la información agregada', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.disciplinarioService.getFileCallReleases(this.id, params).subscribe({
              next: (file: BlobPart) => {
                this.modalService.dismissAll();
                downloadFile({
                  name: `descargo_${this.id}`,
                  type: !this.typeReleases ? 'application/x-zip-compressed' : undefined,
                  file,
                });
                resolve(true);
              },
              error: (error) => {
                this.swalService.show({
                  icon: 'error',
                  title: 'Error inesperado',
                  showCancel: false,
                  text: error.error.err,
                });
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

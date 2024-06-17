import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IconFilePipe } from '@shared/pipes/icon-file.pipe';
import { LoadFile, loadFile } from '@shared/functions/load-file';
import { ListFilesComponent } from '@app/pages/rrhh/procesos/components/list-files/list-files.component';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-multi-files',
  standalone: true,
  imports: [CommonModule, IconFilePipe, ModalComponent, ListFilesComponent],
  templateUrl: './multi-files.component.html',
  styleUrl: './multi-files.component.scss',
})
export class MultiFilesComponent implements OnInit {
  @Input() typeUse: 'modal' | 'view' | 'button' = 'modal';

  @Input() typeFile: string[] = undefined;

  @Input() currentFiles: LoadFile[] = [];

  @Output() sendFiles = new EventEmitter<LoadFile[]>();

  private selectedFiles: LoadFile[] = [];

  listFiles = [];

  sizeFile = 0;

  constructor(
    private readonly swalService: SwalService,
    private readonly modalService: NgbModal,
    private readonly sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.resetValues();
  }

  private resetValues() {
    this.selectedFiles = [];
    this.listFiles = [...this.currentFiles];
  }

  onSelectFiles(event: any): void {
    const fileList = event.target.files as FileList;
    Object.values(fileList).forEach((file) => {
      this.setFile(file);
    });
  }

  onDrop(event) {
    event.preventDefault();
    [...event.dataTransfer.items].forEach((item) => {
      if (item.kind === 'file') {
        this.setFile(item.getAsFile());
      }
    });
  }

  openMultiFiles(modal: TemplateRef<any>): void {
    const modalRef = this.modalService.open(modal, { size: 'lg', centered: true });
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res !== 'save') this.resetValues();
      },
    });
  }

  private setFile(file: File): void {
    if (this.selectedFiles.length >= 10) {
      this.swalService.show({
        icon: 'error',
        title: 'Error de archivo',
        showCancel: false,
        text: 'Límite de 10 archivos superados',
      });
      return;
    }
    if (this.sizeFile + file.size > 30000000) {
      this.swalService.show({
        icon: 'error',
        title: 'Error de archivo',
        showCancel: false,
        text: 'Límite de 30 megas ha sido superado',
      });
      return;
    }
    this.sizeFile += file.size;
    loadFile(file, this.typeFile)
      .then((file) => {
        const listFile: any = { ...file };
        listFile.file = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file.origin));
        this.listFiles.push(listFile);
        delete file.origin;
        this.selectedFiles.push(file);
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

  onDragOver(event: any) {
    event.preventDefault();
  }

  onRemoveFile(index: number): void {
    this.listFiles.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onSendFiles(modal: NgbActiveModal): void {
    if (this.typeUse === 'button') modal.dismiss('save');
    this.sendFiles.emit(this.selectedFiles);
  }
}

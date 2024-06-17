import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconFilePipe } from '@shared/pipes/icon-file.pipe';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-list-files',
  standalone: true,
  imports: [CommonModule, IconFilePipe, ModalComponent, NotDataComponent],
  templateUrl: './list-files.component.html',
  styleUrl: './list-files.component.scss',
})
export class ListFilesComponent {
  @Input() listFiles = [];

  @Input() isModal = true;

  @Input() loading = false;

  @Input() isRemove = true;

  @Output() removeFile = new EventEmitter<number>();

  onRemove(id: number): void {
    this.removeFile.emit(id);
  }
}

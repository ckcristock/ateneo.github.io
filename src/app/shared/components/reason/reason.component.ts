import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TitleCasePipe } from '@angular/common';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';

@Component({
  selector: 'app-reason',
  standalone: true,
  imports: [
    TableComponent,
    ActionActivateComponent,
    ActionDeactivateComponent,
    MatButtonModule,
    MatIconModule,
    ModalComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TitleCasePipe,
  ],
  templateUrl: './reason.component.html',
  styleUrl: './reason.component.scss',
})
export class ReasonComponent {
  @Input() data = [];

  @Input() addColumns: {
    name: string;
    key: string;
  }[] = [];

  @Input() pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  @Input() loading = true;

  @Input() titleReason = '';

  @Output() saveReason = new EventEmitter();

  @Output() newRequest = new EventEmitter();

  @Output() changeStatus = new EventEmitter();

  formReason = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(private readonly swal: SwalService) {}

  onSaveReason(): void {
    this.saveReason.emit(this.formReason);
  }

  onNewPage(): void {
    this.newRequest.emit(this.pagination);
  }

  activateOrCancel(type, status) {
    let data: any = {
      id: type.value,
      status,
    };
    this.changeStatus.emit(data);
  }
}

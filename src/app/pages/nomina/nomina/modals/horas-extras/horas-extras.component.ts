import { Component, Input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';

import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.scss'],
  standalone: true,
  imports: [TableComponent, KeyValuePipe, ModalComponent],
})
export class HorasExtrasComponent {
  @Input() overtime = {};
}

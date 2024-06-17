import { Component, Input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-modal-novedades',
  templateUrl: './modal-novedades.component.html',
  styleUrls: ['./modal-novedades.component.scss'],
  standalone: true,
  imports: [ModalComponent, TableComponent, KeyValuePipe],
})
export class ModalNovedadesComponent {
  @Input() news = null;
}

import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { IngresoPrestacionalComponent } from '../../forms/ingreso-prestacional/ingreso-prestacional.component';

@Component({
  selector: 'app-modal-ingresos-prestacionales',
  templateUrl: './modal-ingresos-prestacionales.component.html',
  styleUrls: ['./modal-ingresos-prestacionales.component.scss'],
  standalone: true,
  imports: [ModalComponent, IngresoPrestacionalComponent],
})
export class ModalIngresosPrestacionalesComponent {
  @Input() data: any = {};

  constructor(private readonly moodalService: NgbModal) {}

  onUpdate() {
    this.moodalService.dismissAll('updated');
  }
}

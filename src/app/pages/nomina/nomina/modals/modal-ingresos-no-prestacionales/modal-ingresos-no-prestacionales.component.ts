import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { IngresoNoPrestacionalComponent } from '../../forms/ingreso-no-prestacional/ingreso-no-prestacional.component';

@Component({
  selector: 'app-modal-ingresos-no-prestacionales',
  templateUrl: './modal-ingresos-no-prestacionales.component.html',
  styleUrls: ['./modal-ingresos-no-prestacionales.component.scss'],
  standalone: true,
  imports: [ModalComponent, IngresoNoPrestacionalComponent],
})
export class ModalIngresosNoPrestacionalesComponent {
  @Input() data: any = {};

  constructor(private readonly moodalService: NgbModal) {}

  onUpdate() {
    this.moodalService.dismissAll('updated');
  }
}

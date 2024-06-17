import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { DeduccionesComponent } from '../../forms/deducciones/deducciones.component';

@Component({
  selector: 'app-modal-deducciones',
  templateUrl: './modal-deducciones.component.html',
  styleUrls: ['./modal-deducciones.component.scss'],
  standalone: true,
  imports: [ModalComponent, DeduccionesComponent],
})
export class ModalDeduccionesComponent {
  @Input() data: any = {};

  constructor(private readonly moodalService: NgbModal) {}

  onUpdate() {
    this.moodalService.dismissAll('updated');
  }
}

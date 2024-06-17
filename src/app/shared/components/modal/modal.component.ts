import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
})
export class ModalComponent {
  @Input() titleModal = '';

  @Input() hideClose = false;

  @Input() reasonClose = '';

  @Input() canExit: boolean = true;

  @Output() closed = new EventEmitter<void>();

  constructor(private readonly modalService: NgbModal) {}

  close(): void {
    if (this.hideClose) {
      this.closed.emit();
      return;
    }
    this.modalService.dismissAll(this.reasonClose);
  }
}

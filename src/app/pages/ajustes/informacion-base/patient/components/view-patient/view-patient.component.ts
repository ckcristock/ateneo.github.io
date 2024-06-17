import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-view-patient',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './view-patient.component.html',
  styleUrl: './view-patient.component.scss',
})
export class ViewPatientComponent {
  @Input() data: any = null;
}

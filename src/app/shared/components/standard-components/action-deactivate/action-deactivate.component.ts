import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-deactivate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-deactivate.component.html',
  styleUrl: './action-deactivate.component.scss',
})
export class ActionDeactivateComponent {
  @Output() action = new EventEmitter();

  deactivate() {
    this.action.emit();
  }
}

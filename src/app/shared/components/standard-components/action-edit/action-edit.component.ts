import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-edit.component.html',
  styleUrl: './action-edit.component.scss',
})
export class ActionEditComponent {
  @Output() action = new EventEmitter();

  edit() {
    this.action.emit();
  }
}

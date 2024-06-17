import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-activate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-activate.component.html',
  styleUrl: './action-activate.component.scss',
})
export class ActionActivateComponent {
  @Output() action = new EventEmitter();

  activate() {
    this.action.emit();
  }
}

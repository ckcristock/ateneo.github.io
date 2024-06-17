import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.scss',
})
export class AddButtonComponent {
  @Output() add = new EventEmitter();
  @HostBinding('class') classes = 'btn btn-primary btn-sm';

  click() {
    this.add.emit();
  }
}

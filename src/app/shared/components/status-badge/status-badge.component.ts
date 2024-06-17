import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  private _status: string = '';

  @Input() classic: boolean = true;

  @Input() class!: string;

  @Input() set status(value: string) {
    this._status = value.toLowerCase();
  }

  get status(): string {
    return this._status;
  }
}

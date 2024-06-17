import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dropdown-actions',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './dropdown-actions.component.html',
  styleUrl: './dropdown-actions.component.scss',
})
export class DropdownActionsComponent {
  @Input() loading = false;
  @Input() buttonDisabled: boolean = false;
}

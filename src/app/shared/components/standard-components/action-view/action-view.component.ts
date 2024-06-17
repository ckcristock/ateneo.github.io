import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ActionButtonComponent,
  routerActionButton,
} from '../action-button/action-button.component';

@Component({
  selector: 'app-action-view',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './action-view.component.html',
  styleUrl: './action-view.component.scss',
})
export class ActionViewComponent {
  @Input() link: routerActionButton = null;
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { typeHeaderButton } from '@shared/interfaces/global.interface';

export interface routerActionButton {
  url: string;
  target?: string;
  params?: Record<string, string>;
}

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
})
export class ActionButtonComponent  {
  @Input() type: typeHeaderButton = 'info';

  @Input() icon = '';

  @Input() text = '';

  @Input() link: routerActionButton = null;
}

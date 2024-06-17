import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { ViewMorePipe } from './view-more.pipe';

@Component({
  selector: 'app-view-more',
  standalone: true,
  imports: [CommonModule, ViewMorePipe, NgbPopoverModule],
  templateUrl: './view-more.component.html',
  styleUrl: './view-more.component.scss',
})
export class ViewMoreComponent {
  @Input() text = '';

  @Input() length = 200;
}

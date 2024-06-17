import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ngb-pagination',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  templateUrl: './ngb-pagination.component.html',
  styleUrl: './ngb-pagination.component.scss',
})
export class NgbPaginationComponent {
  @Input() pagination!: any;
  @Output() pageChange = new EventEmitter();

  onPageChange(event: any) {
    this.pageChange.emit(event);
  }
}

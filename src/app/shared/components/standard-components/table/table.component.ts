import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Pagination } from '@shared/interfaces/global.interface';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, NotDataSaComponent, PaginationComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() loading: boolean = true;

  @Input() arrayData: any[] = null;

  @Input() item: any;

  @Input() pagination: Pagination = null;

  @Output() pageChange = new EventEmitter<Pagination>();

  handlePageEvent(pagination: Pagination) {
    this.pageChange.emit(pagination);
  }
}

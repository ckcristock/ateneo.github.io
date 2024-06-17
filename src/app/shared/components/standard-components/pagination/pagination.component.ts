import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { Pagination } from '@shared/interfaces/global.interface';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit {
  @Input() pagination: Pagination = {
    page: 1,
    pageSize: 100,
    length: 0,
  };

  @Output() pageChange = new EventEmitter<Pagination>();

  @Input() localStorageName = '';

  constructor() {}

  ngOnInit(): void {
    if (this.localStorageName)
      this.pagination.pageSize = +localStorage.getItem(this.localStorageName);
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1;
    localStorage?.setItem(this.localStorageName, this.pagination?.pageSize.toString());
    this.pageChange.emit(this.pagination);
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-inventary-epp',
  standalone: true,
  templateUrl: './table-inventary-epp.component.html',
  styleUrls: ['./table-inventary-epp.component.scss'],
})
export class TableInventaryEppComponent implements OnInit {
  @Input('totalCategory') totalCategory;

  constructor() {}

  ngOnInit(): void {}
}

import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-viaticos-totales',
  templateUrl: './viaticos-totales.component.html',
  styleUrls: ['./viaticos-totales.component.scss'],
  standalone: true,
  imports: [DecimalPipe, TableComponent],
})
export class ViaticosTotalesComponent implements OnInit {
  @Input('data') data;
  constructor() {}

  ngOnInit(): void {}
}

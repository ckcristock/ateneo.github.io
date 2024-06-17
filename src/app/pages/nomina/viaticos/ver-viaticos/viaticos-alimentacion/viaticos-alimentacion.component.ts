import { Component, Input, OnInit } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-viaticos-alimentacion',
  templateUrl: './viaticos-alimentacion.component.html',
  styleUrls: ['./viaticos-alimentacion.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, TableComponent],
})
export class ViaticosAlimentacionComponent implements OnInit {
  @Input('feedings') feedings: any[];
  constructor() {}

  ngOnInit(): void {}
}

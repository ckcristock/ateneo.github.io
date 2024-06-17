import { Component, Input, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-viaticos-viaje',
  templateUrl: './viaticos-viaje.component.html',
  styleUrls: ['./viaticos-viaje.component.scss'],
  standalone: true,
  imports: [TitleCasePipe, TableComponent],
})
export class ViaticosViajeComponent implements OnInit {
  @Input('data') data: any;
  @Input('all') all = true;
  constructor() {}

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { HotelesComponent } from './hoteles/hoteles.component';
import { TaxisComponent } from './taxis/taxis.component';

@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.component.html',
  styleUrls: ['./viaticos.component.scss'],
  standalone: true,
  imports: [TaxisComponent, HotelesComponent],
})
export class ViaticosComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

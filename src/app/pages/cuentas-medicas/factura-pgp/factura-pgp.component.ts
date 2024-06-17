import { Component, OnInit } from '@angular/core';
import { BuildingComponent } from '../../../components/building/building.component';

@Component({
  selector: 'app-factura-pgp',
  templateUrl: './factura-pgp.component.html',
  styleUrls: ['./factura-pgp.component.css'],
  standalone: true,
  imports: [BuildingComponent],
})
export class FacturaPgpComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

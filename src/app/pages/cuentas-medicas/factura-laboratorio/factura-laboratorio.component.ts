import { Component, OnInit } from '@angular/core';
import { BuildingComponent } from '../../../components/building/building.component';

@Component({
  selector: 'app-factura-laboratorio',
  templateUrl: './factura-laboratorio.component.html',
  styleUrls: ['./factura-laboratorio.component.css'],
  standalone: true,
  imports: [BuildingComponent],
})
export class FacturaLaboratorioComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

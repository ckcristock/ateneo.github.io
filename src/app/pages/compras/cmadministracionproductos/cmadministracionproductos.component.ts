import { Component, OnInit } from '@angular/core';
import { TablaproductoscontrolcantidadComponent } from './tablaproductoscontrolcantidad/tablaproductoscontrolcantidad.component';
import { CmproductossimilaresComponent } from './cmproductossimilares/cmproductossimilares.component';

@Component({
  selector: 'app-cmadministracionproductos',
  templateUrl: './cmadministracionproductos.component.html',
  styleUrls: ['./cmadministracionproductos.component.scss'],
  standalone: true,
  imports: [CmproductossimilaresComponent, TablaproductoscontrolcantidadComponent],
})
export class CmadministracionproductosComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

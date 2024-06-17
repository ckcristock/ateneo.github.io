import { Component, OnInit } from '@angular/core';
import { TablaproductossimilaresComponent } from './tablaproductossimilares/tablaproductossimilares.component';

@Component({
  selector: 'app-cmproductossimilares',
  templateUrl: './cmproductossimilares.component.html',
  styleUrls: ['./cmproductossimilares.component.scss'],
  standalone: true,
  imports: [TablaproductossimilaresComponent],
})
export class CmproductossimilaresComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

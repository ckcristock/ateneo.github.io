import { Component, OnInit, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tablafacturafaltante',
  templateUrl: './tablafacturafaltante.component.html',
  styleUrls: ['./tablafacturafaltante.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class TablafacturafaltanteComponent implements OnInit {
  @Input() Facturas_Faltantes;
  constructor() {}

  ngOnInit(): void {}
}

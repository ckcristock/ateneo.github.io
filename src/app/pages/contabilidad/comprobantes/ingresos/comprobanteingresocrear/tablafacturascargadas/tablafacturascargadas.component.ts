import { Component, OnInit, Input } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-tablafacturascargadas',
  templateUrl: './tablafacturascargadas.component.html',
  styleUrls: ['./tablafacturascargadas.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
})
export class TablafacturascargadasComponent implements OnInit {
  @Input() Facturas;
  constructor() {}

  ngOnInit(): void {}
}

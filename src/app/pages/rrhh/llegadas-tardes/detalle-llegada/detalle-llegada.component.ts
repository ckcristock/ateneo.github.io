import { Component, Input, OnInit } from '@angular/core';
import { NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalle-llegada',
  templateUrl: './detalle-llegada.component.html',
  styleUrls: ['./detalle-llegada.component.scss'],
  standalone: true,
  imports: [NgFor, DatePipe],
})
export class DetalleLlegadaComponent implements OnInit {
  @Input('person') person: any;
  constructor() {}

  ngOnInit(): void {}
}

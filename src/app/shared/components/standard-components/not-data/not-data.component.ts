import { Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-not-data',
  templateUrl: './not-data.component.html',
  styleUrls: ['./not-data.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class NotDataComponent implements OnInit {
  @Input('loading') loading;
  @Input('text') text;
  description = '';
  constructor() {}

  ngOnInit(): void {
    this.description = this.text ? this.text : 'No existen datos para mostrar';
  }
}

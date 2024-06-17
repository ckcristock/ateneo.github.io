import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone: true,
  imports: [DecimalPipe],
})
export class StatsComponent implements OnInit {
  @Input('icon') icon: any;
  @Input('value') value: any;
  @Input('title') title: any;

  constructor() {}

  ngOnInit(): void {}
}

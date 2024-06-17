import { Component, OnInit, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
  standalone: true,
  imports: [CurrencyPipe],
})
export class StatComponent implements OnInit {
  @Input() title: string;
  @Input() value: string;
  @Input() icon: string;

  constructor() {}

  ngOnInit(): void {}
}

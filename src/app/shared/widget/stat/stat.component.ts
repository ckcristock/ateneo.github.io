import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  standalone: true,
  styleUrls: ['./stat.component.scss'],
})
export class StatComponent implements OnInit {
  @Input() title: string;
  @Input() value: string;
  @Input() icon: string;

  constructor() {}

  ngOnInit(): void {}
}

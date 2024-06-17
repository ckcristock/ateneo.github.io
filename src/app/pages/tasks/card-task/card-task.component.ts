import { Component, Input, OnInit } from '@angular/core';
import { NgIf, NgStyle, DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-task',
  templateUrl: './card-task.component.html',
  styleUrls: ['./card-task.component.scss'],
  standalone: true,
  imports: [NgIf, NgStyle, DatePipe],
})
export class CardTaskComponent implements OnInit {
  @Input('list') list;
  @Input('view_state') view_state = false;
  constructor() {}

  ngOnInit(): void {}
}

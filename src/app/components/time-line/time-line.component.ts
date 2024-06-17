import { Component, OnInit, Input } from '@angular/core';
import { History } from 'src/app/core/interfaces/history.interface';
import { TimeLine } from 'src/app/core/interfaces/time-line.interface';
import { ImagePipe } from '../../core/pipes/image.pipe';
import { NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss'],
  standalone: true,
  imports: [NgFor, DatePipe, ImagePipe],
})
export class TimeLineComponent implements OnInit {
  @Input('data') data!: History[];
  constructor() {}

  ngOnInit(): void {}
}

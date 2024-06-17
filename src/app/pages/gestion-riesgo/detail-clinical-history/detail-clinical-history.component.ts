import { Component, Input, OnInit } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-detail-clinical-history',
  templateUrl: './detail-clinical-history.component.html',
  styleUrls: ['./detail-clinical-history.component.scss'],
  standalone: true,
  imports: [NgFor, RouterLinkActive, RouterLink],
})
export class DetailClinicalHistoryComponent implements OnInit {
  constructor() {}
  @Input('histories') histories: Array<Object>;
  ngOnInit(): void {}
}

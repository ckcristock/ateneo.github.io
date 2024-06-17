import { Component, OnInit, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-pagetitle',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf],
})
export class PagetitleComponent implements OnInit {
  @Input() breadcrumbItems;
  @Input() title: string;

  constructor() {}

  ngOnInit(): void {}
}

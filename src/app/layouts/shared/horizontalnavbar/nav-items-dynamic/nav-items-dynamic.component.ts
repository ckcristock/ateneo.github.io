import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-nav-items-dynamic',
  templateUrl: './nav-items-dynamic.component.html',
  styleUrls: ['./nav-items-dynamic.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
})
export class NavItemsDynamicComponent implements OnInit {
  @Input('navItems') navItems: any;
  @Input('first') first: any;

  constructor() {}

  ngOnInit(): void {}
}

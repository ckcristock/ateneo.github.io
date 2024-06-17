import { Component, Input, OnInit } from '@angular/core';
import { NgIf, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
  standalone: true,
  imports: [NgIf, DecimalPipe],
})
export class ListItemsComponent implements OnInit {
  @Input('title1')
  title1!: string;
  @Input('title2')
  title2!: string;
  @Input('title3')
  title3!: string;
  @Input('title4')
  title4!: string;
  @Input('title5')
  title5!: string;
  @Input('var1')
  var1!: string;
  @Input('var2')
  var2!: string;
  @Input('var3')
  var3!: string;
  @Input('var4')
  var4!: string;
  @Input('var5')
  var5!: string;
  @Input('type1')
  type1!: string;
  @Input('type2')
  type2!: string;
  @Input('type3')
  type3!: string;
  @Input('type4')
  type4!: string;
  @Input('type5')
  type5!: string;
  @Input('justifyContent') justifyContent = 'justify-content-end';
  @Input('col') col = 'col-md-5';
  @Input('mt')
  mt!: 'mt-0';

  classList: string =
    'list-group-item d-flex py-1 px-2 justify-content-between align-items-center list-group-item-action list-group-item-primary';
  constructor() {}

  ngOnInit(): void {}
}

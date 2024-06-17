import { Component, OnInit } from '@angular/core';
import { EMPRESA } from '@app/core/utils/consts';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
})
export class FooterComponent implements OnInit {
  today = new Date();
  year: number;
  company = EMPRESA;
  constructor() {}

  ngOnInit(): void {
    this.year = this.today.getFullYear();
  }
}

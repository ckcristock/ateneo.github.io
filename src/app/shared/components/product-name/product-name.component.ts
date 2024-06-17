import { Component, Input } from '@angular/core';
import { ViewMoreComponent } from '../view-more/view-more.component';

@Component({
  selector: 'app-product-name',
  standalone: true,
  imports: [ViewMoreComponent],
  templateUrl: './product-name.component.html',
  styleUrl: './product-name.component.scss',
})
export class ProductNameComponent {
  @Input() data: any = {};
}

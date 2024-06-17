import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../producto.service';
import { NgClass, UpperCasePipe, DecimalPipe, DatePipe } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { PlaceholderFormComponent } from 'src/app/components/placeholder-form/placeholder-form.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    PlaceholderFormComponent,
    NotDataComponent,
    UpperCasePipe,
    DecimalPipe,
    DatePipe,
  ],
})
export class ProductoComponent implements OnInit {
  product_id: any;
  product: any = {};
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private _product: ProductoService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.product_id = params.get('id');
      this.getProduct();
    });
  }

  getProduct() {
    this.loading = true;
    this._product.show(this.product_id).subscribe((res: any) => {
      this.product = res.data;
      this.loading = false;
    });
  }
}

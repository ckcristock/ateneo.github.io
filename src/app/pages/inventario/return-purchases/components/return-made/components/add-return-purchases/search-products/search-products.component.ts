import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

import { ReturnPurchasesService } from 'src/app/pages/inventario/return-purchases/return-purchases.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    ModalComponent,
    AutomaticSearchComponent,
    LoadImageComponent,
    NotDataComponent,
  ],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.scss',
})
export class SearchProductsComponent {
  @Output() selectedProducts = new EventEmitter();

  products = [];

  newProducts = [];

  filters = {
    nom: '',
    lab_com: '',
    lab_gen: '',
    cum: '',
  };

  loading = false;

  constructor(private readonly returnPurchasesService: ReturnPurchasesService) {}

  handleProduct(product: MatCheckboxChange): void {
    const { Id_Producto } = product.source.value as any;
    if (product.checked) this.newProducts.push(product.source.value);
    else this.newProducts = this.newProducts.filter((pro) => pro.Id_Producto !== Id_Producto);
  }

  getProducts(): void {
    this.loading = true;
    this.returnPurchasesService.getProducts(this.filters).subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
    });
  }

  saveProducts(): void {
    this.selectedProducts.emit(this.newProducts);
  }
}

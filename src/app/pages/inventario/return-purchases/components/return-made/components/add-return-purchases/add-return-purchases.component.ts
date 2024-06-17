import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BodeganuevoService } from 'src/app/core/services/bodeganuevo.service';

import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { SearchProductsComponent } from './search-products/search-products.component';
import { ReturnPurchasesService } from '../../../../return-purchases.service';
import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-add-return-purchases',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AutocompleteFcComponent,
    NotDataComponent,
  ],
  templateUrl: './add-return-purchases.component.html',
  styleUrl: './add-return-purchases.component.scss',
})
export class AddReturnPurchasesComponent implements OnInit {
  formAddReturn!: FormGroup;

  wineries = [];

  receiptRecord = [];

  products = [];

  taxes = [];

  providers = [];

  invoices = [];

  reasons = [];

  totalReturn = 0;

  taxReturn = 0;

  subtotalReturn = 0;

  loadFile = false;

  loading = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly bodegaService: BodeganuevoService,
    private readonly returnPurchasesService: ReturnPurchasesService,
    private readonly swalService: SwalService,
    private readonly modalService: NgbModal,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.getWineries();
    this.getProviders();
    this.getTax();
    this.getReason();
  }

  private formInit(): void {
    this.formAddReturn = this.formBuilder.group({
      id_proveedor: ['', [Validators.required]],
      Id_Bodega_Nuevo: ['', [Validators.required]],
      soporte: ['', [Validators.required]],
      Observaciones: [''],
      acta: [{ value: '', disabled: true }, [Validators.required]],
      products: new FormArray([]),
    });
  }

  private getWineries(): void {
    this.bodegaService.getBodegas().subscribe({
      next: (res) => {
        this.wineries = res.Bodegas;
      },
    });
  }

  private getProviders(): void {
    this.returnPurchasesService.getProviders().subscribe({
      next: (res) => {
        this.providers = res;
      },
    });
  }

  private getTax(): void {
    this.returnPurchasesService.getTax().subscribe({
      next: (res) => {
        this.taxes = res;
      },
    });
  }

  private getReason(): void {
    this.returnPurchasesService.getReason().subscribe({
      next: (res) => {
        this.reasons = res;
      },
    });
  }

  getInvoiceRecord(): void {
    const id = this.formAddReturn.get('acta').value;
    this.returnPurchasesService.getInvoiceRecord(id).subscribe({
      next: (res) => {
        this.invoices = res;
      },
    });
  }

  openAddProduct(): void {
    const modalRef = this.modalService.open(SearchProductsComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.selectedProducts.subscribe({
      next: (res: Array<any>) => {
        res.forEach((pro) => {
          const formArray = this.formBuilder.group({
            Cantidad: ['0'],
            Motivo: ['', [Validators.required]],
            Factura: ['', [Validators.required]],
            Impuesto: ['', [Validators.required]],
            Subtotal: ['0'],
            Total_Impuesto: ['0'],
          });
          this.productsControls.push(formArray);
          this.products.push(pro);
        });
        this.modalService.dismissAll();
      },
    });
  }

  onGetReception(): void {
    this.receiptRecord = [];
    const { id_proveedor } = this.formAddReturn.value;
    this.returnPurchasesService.getReceptionReport(id_proveedor).subscribe({
      next: (res) => {
        this.receiptRecord = res;
        this.formAddReturn.get('acta').enable();
      },
    });
  }

  onFileSupport(event: any): void {
    this.formAddReturn.get('soporte').setValue(event.target.files[0]);
    this.loadFile = true;
  }

  onHandleProductValue(index: number): void {
    const quantity = +this.productsControls.controls[index].get('Cantidad').value;
    if (quantity < 1 || quantity > this.products[index].Cantidad_Inventario)
      this.swalService.show({
        icon: 'error',
        title: '¡Error al digitar cantidades!',
        text: 'La cantidad del producto no puede ser menor a (1) ni mayor a la cantidad disponible',
        showCancel: false,
      });
    this.onCalculatePrices(index);
  }

  onCalculatePrices(index: number): void {
    const product = this.productsControls.controls[index];
    product
      .get('Total_Impuesto')
      .setValue(+product.get('Subtotal').value * (+product.get('Impuesto').value / 100));
    this.calculateTotalValues();
  }

  private calculateTotalValues(): void {
    const reducer = (key: string) => {
      return (acc, curr) => {
        return acc + parseFloat(curr.get(key).value);
      };
    };

    this.subtotalReturn = this.productsControls.controls.reduce(reducer('Subtotal'), 0);
    this.taxReturn = this.productsControls.controls.reduce(reducer('Total_Impuesto'), 0);
    this.totalReturn = this.subtotalReturn - this.taxReturn;
  }

  async onMakeReturn(): Promise<void> {
    const body = new FormData();
    const data = this.formAddReturn.value;
    body.append('productos', JSON.stringify(data.products));
    delete data.products;
    body.append('datos', JSON.stringify(data));
    try {
      await this.swalService.confirm('Se creará una nueva devolución', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.returnPurchasesService.postNewReturnPurchases(body).subscribe({
              next: (res) => {
                this.swalService.show({
                  icon: 'success',
                  title: 'Devoluciones',
                  text: res.mensaje,
                  timer: 1000,
                  showCancel: false,
                });
                this.router.navigate(['inventario/devoluciones']);
                resolve(true);
              },
              error: () => {
                resolve(false);
              },
            });
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this.swalService.hardError();
    }
  }

  private get productsControls(): FormArray<any> {
    return this.formAddReturn.get('products') as FormArray;
  }
}

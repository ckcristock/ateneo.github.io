import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

import { BodeganuevoService } from 'src/app/core/services/bodeganuevo.service';
import { ActaRecepcionService } from 'src/app/pages/inventario/acta-recepcion/acta-recepcion.service';
import { ReturnPurchasesService } from '../../../../return-purchases.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatInputModule } from '@angular/material/input';
import { ListItemsComponent } from '@app/components/list-items/list-items.component';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-create-purchase-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ModalComponent,
    AutocompleteFcComponent,
    TextFieldModule,
    NotDataComponent,
    ListItemsComponent,
    MatCheckboxModule,
  ],
  templateUrl: './create-purchase-order.component.html',
  styleUrl: './create-purchase-order.component.scss',
})
export class CreatePurchaseOrderComponent implements OnInit {
  @Input() id: number;

  @Input() idNonconforming: number;

  formCreatePurchase: FormGroup;

  wineries = [];

  products = [];

  providers = [];

  dispensingPoints = [];

  taxes = [];

  indexSelected: number[] = [];

  valueTaxSelected: number[] = [];

  totalReturn = 0;

  taxReturn = 0;

  subtotalReturn = 0;

  userId = 0;

  loading = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly swalService: SwalService,
    private readonly actReceptionService: ActaRecepcionService,
    private readonly bodegaService: BodeganuevoService,
    private readonly returnPurchasesService: ReturnPurchasesService,
    private readonly modalService: NgbModal,
    private readonly userService: UserService,
  ) {
    this.userId = +userService.user.id;
  }

  ngOnInit(): void {
    this.formInit();
    this.getProduct();
    this.getWineries();
    this.getProviders();
    this.getTax();
    this.getDispensingPoint();
  }

  private formInit(): void {
    this.formCreatePurchase = this.formBuilder.group({
      Tipo_Bodega: ['', [Validators.required]],
      Proveedor: ['', [Validators.required]],
      Id_Bodega_Nuevo: [''],
      Id_Punto_Dispensacion: [''],
      Fecha_Entrega_Probable: ['', [Validators.required]],
      Observaciones: [''],
      products: this.formBuilder.array([]),
    });
  }

  private getProduct(): void {
    const params = {
      id: this.id,
    };
    this.actReceptionService.detalleActa(params).subscribe({
      next: (res: any) => {
        this.products = res.data.productos_no_conforme;
        this.valueTaxSelected = this.products.map((product) => product.Iva);
        this.products.forEach((product) => {
          const formArray = this.formBuilder.group({
            Cantidad: [{ value: product.Cantidad, disabled: true }],
            Costo: [{ value: +product.Costo, disabled: true }],
            impuesto_id: [{ value: 0, disabled: true }],
            Valor_Iva: [{ value: product.Iva, disabled: true }],
            Subtotal: [{ value: +product.Subtotal, disabled: true }],
            Id_No_Conforme: [{ value: product.Id_Causal_No_Conforme, disabled: true }],
            Id_Producto_No_Conforme: [{ value: product.Id_Producto_No_Conforme, disabled: true }],
            Total: [{ value: product.Total, disabled: true }],
            Id_Producto: [{ value: product.Id_Producto, disabled: true }],
          });
          this.productsControls.push(formArray);
        });
        this.calculateTotalValues();
        this.loading = false;
      },
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
        this.providers = res.data;
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

  private getDispensingPoint(): void {
    this.returnPurchasesService.getDispensingPoint(this.userId).subscribe({
      next: (res) => {
        this.dispensingPoints = res.data;
      },
    });
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
  }

  onSelectProduct(event: MatCheckboxChange, index: number) {
    if (event.checked) {
      this.indexSelected.push(index);
      this.productsControls.controls[index].enable();
      return;
    }
    this.indexSelected = this.indexSelected.filter((value) => value !== index);
    this.productsControls.controls[index].disable();
  }

  onSelectTax(index: number, value: number) {
    this.valueTaxSelected[index] = value;
    this.onCalculatePrices(index);
  }

  onCalculatePrices(index: number): void {
    const product = this.productsControls.controls[index];
    const { Cantidad = 0, Costo = 0 } = product.getRawValue();
    product.get('Subtotal').setValue(+Cantidad * +Costo);
    product
      .get('Valor_Iva')
      .setValue(+product.get('Subtotal').value * (this.valueTaxSelected[index] / 100));
    const { Valor_Iva, Subtotal } = product.getRawValue();
    product.get('Total').setValue(Valor_Iva + Subtotal);
    this.calculateTotalValues();
  }

  private calculateTotalValues(): void {
    const reducer = (key: string) => {
      return (acc, curr) => {
        return acc + parseFloat(curr.get(key).value);
      };
    };

    this.subtotalReturn = this.productsControls.controls.reduce(reducer('Subtotal'), 0);
    this.taxReturn = this.productsControls.controls.reduce(reducer('Valor_Iva'), 0);
    this.totalReturn = this.subtotalReturn + this.taxReturn;
  }

  async generateOrder(): Promise<void> {
    const body = new FormData();
    const data = this.formCreatePurchase.value;
    body.append('modulo', 'Orden_Compra_Nacional');
    body.append('Id_No_Conforme', String(this.idNonconforming));
    body.append('productos', JSON.stringify(data.products));
    delete data.products;
    body.append('datos', JSON.stringify(data));

    try {
      await this.swalService.confirm(
        'Se dispone a generar la orden de compra y cerrar la no conformidad',
        {
          preConfirm: () => {
            return new Promise((resolve) => {
              this.returnPurchasesService.postGenerateNewOrder(body).subscribe({
                next: (res) => {
                  this.swalService.show({
                    icon: 'success',
                    title: '¡Creación de orden de compras!',
                    showCancel: false,
                    text: res.mensaje,
                    timer: 1000,
                  });
                  resolve(true);
                  this.modalService.dismissAll('generate-order');
                },
                error: () => {
                  resolve(false);
                },
              });
            });
          },
          showLoaderOnConfirm: true,
        },
      );
    } catch (error) {
      this.swalService.hardError();
    }
  }

  get productsControls(): FormArray<any> {
    return this.formCreatePurchase.get('products') as FormArray;
  }
}

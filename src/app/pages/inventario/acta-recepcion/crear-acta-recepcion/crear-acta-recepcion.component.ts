import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ActaRecepcionService } from '../acta-recepcion.service';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { consts } from 'src/app/core/utils/consts';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { InputPositionDirective } from '../../../../core/directives/input-position.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputPositionInitialDirective } from '../../../../core/directives/input-position-initial.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';
import { NgIf, NgFor, UpperCasePipe, DecimalPipe, TitleCasePipe, NgClass } from '@angular/common';
import { PlaceholderFormComponent } from '../../../../components/placeholder-form/placeholder-form.component';
import { ListItemsComponent } from '@app/components/list-items/list-items.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { ProductNameComponent } from '@shared/components/product-name/product-name.component';

@Component({
  selector: 'app-crear-acta-recepcion',
  templateUrl: './crear-acta-recepcion.component.html',
  styleUrls: ['./crear-acta-recepcion.component.scss'],
  standalone: true,
  imports: [
    PlaceholderFormComponent,
    NgIf,
    CabeceraComponent,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCheckboxModule,
    NgxCurrencyDirective,
    NgClass,
    InputPositionInitialDirective,
    MatTooltipModule,
    InputPositionDirective,
    MatInputModule,
    TextFieldModule,
    NotDataComponent,
    UpperCasePipe,
    DecimalPipe,
    TitleCasePipe,
    ListItemsComponent,
    NgbPopoverModule,
    TableComponent,
    ProductNameComponent,
  ],
})
export class CrearActaRecepcionComponent implements OnInit {
  mask = consts;
  loading: boolean = false;
  datosCabecera = {
    Titulo: 'Nueva acta de recepción',
    Fecha: new Date(),
    Codigo: '',
    CodigoFormato: '',
  };
  form: FormGroup;
  ordenCompra: any[] = [];
  history: any;

  nonConformingData = [];

  products = [];

  groupProducts = [];

  taxIva = [];

  totals = {
    Subtotal: 0,
    Iva: 0,
    Total: 0,
  };

  receivedTotals = {
    Subtotal: 0,
    Iva: 0,
    Total: 0,
  };

  formProducts: FormGroup = new FormGroup({});

  get invoices() {
    return this.form.get('invoices') as FormArray;
  }

  get products_acta() {
    return this.form.get('products_acta') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _swal: SwalService,
    private _actaRecepcion: ActaRecepcionService,
    private _consecutivos: ConsecutivosService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getNonConforming();
    this.getTaxIva();
    this.createForm();
    this.route.paramMap.subscribe(async (params) => {
      let p = {
        id: params.get('id'),
        compra: params.get('compra'),
      };
      await this.getActaRecepcion(p);
      await this.validate(params.get('id'));
      this.getConsecutivo();
      this.loading = false;
    });
  }

  private getNonConforming() {
    this._actaRecepcion.getNonConforming().subscribe({
      next: (res: any) => {
        this.nonConformingData = res.data;
      },
    });
  }

  async validate(id) {
    await this._actaRecepcion
      .validate(id)
      .toPromise()
      .then((res: any) => {
        this.history = res.data;
        this.form.patchValue({
          Id_Acta_Recepcion: this.history ? this.history.Id_Acta_Recepcion : '',
          Observaciones: [this.history ? this.history.Observaciones : ''],
          Codigo: [this.history ? this.history.Codigo : ''],
        });
        if (res.data?.facturas.length > 0) {
          res.data.facturas.forEach((invoice) => {
            this.addInvoice(invoice);
          });
        }
        if (res.data?.grouped_products)
          this.groupProducts = Object.values(res.data?.grouped_products).map((pro) => pro);
        if (this.groupProducts.length) {
          this.groupProducts.forEach((pro: any[]) => {
            this.products.forEach((product, index) => {
              let exist = pro.some((v) => v.Id_Producto == product.Id_Producto);
              if (exist) this.products.splice(index, 1);
            });
          });
        }

        this.setProductList();
        this.calculateReceivedTotals();
      });
  }

  async getActaRecepcion(params) {
    await this._actaRecepcion
      .getActaRecepcionCompra(params)
      .toPromise()
      .then((res: any) => {
        this.ordenCompra = res.data;
        this.products = [...res.data.products];
      });
  }

  private setProductList() {
    this.products.forEach((pro, index) => {
      this.products_acta.push(
        this.fb.group({
          [index]: this.fb.array([this.addProducts(pro)]),
          toAdd: [pro?.Id_Producto_Acta_Recepcion ? true : false],
        }),
      );
      this.onActiveProduct(index, false);
    });
  }

  getFormArray(index: number) {
    return this.products_acta.get(String(index)).get(String(index)) as FormArray;
  }

  getTaxIva() {
    this._actaRecepcion.getTaxIva().subscribe({
      next: (res: any) => {
        this.taxIva = res.data;
      },
    });
  }

  getConsecutivo() {
    this._consecutivos
      .getConsecutivo('acta_recepcion')
      .toPromise()
      .then((r: any) => {
        this.datosCabecera.CodigoFormato = r.data.format_code;

        if (!this.history) {
          this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato });
          let con = this._consecutivos.construirConsecutivo(r.data);
          this.datosCabecera.Codigo = con;
        } else {
          this.datosCabecera.Codigo = this.history.Codigo;
        }
      });
  }

  // Esto es lo que va a la tabla de 'acta_recepcion'

  createForm() {
    this.form = this.fb.group(
      {
        Id_Acta_Recepcion: '',
        Observaciones: [''],
        Codigo: [''],
        invoices: this.fb.array([]),
        products_acta: this.fb.array([]),
      },
      { validators: this.validateCheckbox },
    );
  }

  validateCheckbox(group: FormGroup) {
    const products_acta = group.get('products_acta') as FormArray;
    const isChecked = products_acta.controls.some((control) => control.get('toAdd').value === true);
    return isChecked ? null : { noChecked: true };
  }

  // Esto es lo que va a la tabla facturas_acta_recepcion
  addInvoice(invoice = null) {
    let addFactura = this.fb.group({
      Id_Factura_Acta_Recepcion: [invoice ? invoice.Id_Factura_Acta_Recepcion : ''],
      Archivo_Factura: [invoice ? invoice.Archivo_Factura : '', Validators.required],
      type: [invoice ? invoice.type : ''],
      Factura: [invoice ? invoice.Factura : '', Validators.required],
      Fecha_Factura: [invoice ? invoice.Fecha_Factura : '', Validators.required],
      cufe: [
        invoice ? invoice.Cufe : '',
        [Validators.required, Validators.minLength(40), Validators.maxLength(40)],
      ],
    });

    // if (invoice && invoice.Id_Factura_Acta_Recepcion) {
    //   Object.keys(addFactura.controls).forEach(controlName => {
    //     addFactura.get(controlName).disable();
    //   })
    // }

    this.invoices.push(addFactura);
  }

  // esto va a la tabla de productos_acta_recepcion
  addProducts(element, isSecondItem?: boolean) {
    let add = this.fb.group({
      Id_Producto_Acta_Recepcion: [
        element?.Id_Producto_Acta_Recepcion ? element.Id_Producto_Acta_Recepcion : null,
      ],
      Factura: [''],
      Cantidad: [''], //  falta crear un validador de checkbox
      Subtotal: [''],
      Iva: [''],
      Total: [''],
      subcategory: element?.product?.category?.Nombre || element.product?.subcategory?.Nombre,
      nonConform: [''],
      lote: [''],
      fecha_vencimiento: [''],
      nonConformNum: [''],
      price: [''],
      iva_: [element?.product?.impuesto_id],
      imagen: [element?.product?.Imagen],
      nombre: [element?.product?.Nombre_Comercial],
      unidad: [element?.product?.unit?.name],
      cantidad_: [element?.Cantidad],
      subtotal_: [element?.Subtotal],
      total_: [element?.Total],
      Id_Producto: [element?.product?.Id_Producto],
      variables: this.fb.array([]),
      // con imagen, y con campos para la cantidad, el iva y los precios (precio total, precio iva, subtotal sin iva),
      // Subtotal, Impuesto, Precio, Cantidad, Unidad
    });

    element.variables.forEach((vars) => {
      (add.get('variables') as FormArray).push(
        this.fb.group({
          ...vars,
          value: [
            '',
            [
              vars.required === 'Si' && !isSecondItem
                ? Validators.required
                : Validators.nullValidator,
            ],
          ],
        }),
      );
    });

    add.get('Cantidad').valueChanges.subscribe({
      next: () => {
        this.onCalculatetotalProduct(add);
        this.onCalculateTotals();
      },
    });
    add.get('price').valueChanges.subscribe({
      next: () => {
        this.onCalculatetotalProduct(add);
        this.onCalculateTotals();
      },
    });
    add.get('iva_').valueChanges.subscribe({
      next: (value) => {
        this.onCalculatetotalProduct(add);
        this.onCalculateTotals();
      },
    });

    // this.products_acta.push(add);

    return add;
  }

  addItemProduct(indexProduct: number, indexItem: number) {
    const product = this.products[indexProduct];
    const notMulti =
      Boolean(
        !product.product.category.has_expiration_date || !product.product.category.has_lote,
      ) || !!this.getFormArray(indexProduct).value[indexItem + 1];
    if (notMulti) return;
    this.getFormArray(indexProduct).push(this.addProducts(product, true));
  }

  onActiveProduct(index: number, isChecked: boolean) {
    const formArray = this.getFormArray(index);
    const fields = [
      'Factura',
      'Subtotal',
      'Cantidad',
      'iva_',
      'Total',
      'price',
      'fecha_vencimiento',
      'lote',
    ];
    formArray.controls.forEach((add, index) => {
      const vars = add.get('variables') as FormArray;
      if (isChecked) {
        add.get('nonConform').enable();
        add.get('nonConform').enable();
        vars.enable();
        fields.forEach((field) => add.get(field).enable());
        vars.controls.forEach((field) => field.enable());
        // fields.forEach(field => add.get(field).setValidators(Validators.compose([Validators.required, Validators.minLength(1)])));
        if (index === 0)
          fields.forEach((field) =>
            add
              .get(field)
              .setValidators([
                Validators.required,
                field === 'Cantidad' ? Validators.min(1) : Validators.nullValidator,
              ]),
          );
      } else {
        add.get('nonConform').disable();
        vars.controls.forEach((field) => {
          field.get('value').reset();
          field.disable();
        });
        fields.forEach((field) => add.get(field).disable());
        //fields.forEach(field => add.get(field).clearValidators());
        if (index === 0) fields.forEach((field) => add.get(field).setValidators(null));
        add.patchValue({
          Factura: '',
          Cantidad: '',
          Subtotal: '',
          iva_: '',
          Total: '',
        } as any);
      }
      fields.forEach((field) => add.get(field).updateValueAndValidity());
    });
  }

  removeInvoice(index: number) {
    this.invoices.removeAt(index);
  }

  onSelectNonConforming(group: FormGroup) {
    const nonConformControl = group.get('nonConform');
    const nonConformQuanControl = group.get('nonConformNum');
    if (nonConformControl.value) {
      nonConformQuanControl.enable();
      nonConformQuanControl.setValidators([Validators.required]);
    } else {
      nonConformQuanControl.disable();
      nonConformQuanControl.setValidators(null);
    }
    nonConformQuanControl.updateValueAndValidity();
  }

  onCalculatetotalProduct(group: FormGroup) {
    const { iva_ = 0, price = 0, Cantidad = 0 } = group.getRawValue();

    group.get('Subtotal').setValue(+Cantidad * +price);
    const { Subtotal = 0 } = group.getRawValue();

    const iva = this.taxIva.find((tax) => tax.Id_Impuesto == iva_)?.Valor || 0;
    group.get('Total').setValue(+Subtotal + +Subtotal * (+iva / 100));
  }

  onCalculateTotals() {
    this.totals = {
      Subtotal: this.products_acta.controls.reduce((acc, current, index) => {
        this.getFormArray(index).controls.forEach((group) => {
          acc += +group.getRawValue()['Subtotal'];
        });
        return acc;
      }, 0),
      Iva: this.products_acta.controls.reduce((acc, current, index) => {
        this.getFormArray(index).controls.forEach((group) => {
          const iva =
            this.taxIva.find((tax) => tax.Id_Impuesto == +group.getRawValue()['iva_'])?.Valor || 0;
          acc += +group.getRawValue()['Subtotal'] * (iva / 100);
        });
        return acc;
      }, 0),
      Total: this.products_acta.controls.reduce((acc, current, index) => {
        this.getFormArray(index).controls.forEach((group) => {
          acc += +group.getRawValue()['Total'];
        });
        return acc;
      }, 0),
    };
  }

  private calculateReceivedTotals() {
    this.receivedTotals = {
      Subtotal: this.groupProducts.reduce((acc, current) => {
        current.forEach((product) => {
          acc += +product['Subtotal'];
        });
        return acc;
      }, 0),
      Iva: this.groupProducts.reduce((acc, current) => {
        current.forEach((product) => {
          product['iva'] = +product['Subtotal'] * (product['Impuesto'] / 100);
          acc += product['iva'];
        });
        return acc;
      }, 0),
      Total: this.groupProducts.reduce((acc, current) => {
        current.forEach((product) => {
          product['Total'] = product['Subtotal'] + product['iva'];
          acc += +product['Total'];
        });
        return acc;
      }, 0),
    };
  }

  saveActa() {
    if (this.form.valid) {
      const request = () => {
        let newArray = Array.from(this.products_acta.value)
          .filter((product: any) => product.toAdd == true)
          .map((product: any) => {
            delete product.toAdd;
            const newProduct = [];
            Object.keys(product).forEach((key) => {
              product[key].forEach((pro) => {
                const newVars = [];
                pro.variables.forEach((vars) => {
                  newVars.push({
                    id: null,
                    category_id: vars?.category_id ? vars?.id : undefined,
                    subcategory_id: vars?.subcategory_id ? vars?.id : undefined,
                    value: vars.value,
                  });
                });
                pro.variables = newVars;
                if (pro.Cantidad) newProduct.push(pro);
              });
            });
            return newProduct;
          });

        //sacar los que no esten marcados
        const data = {
          selected_products: newArray,
          Observaciones_acta: this.form.get('Observaciones').value,
          ...this.form.getRawValue(),
          ...this.ordenCompra,
        };

        this._actaRecepcion.save(data).subscribe(
          (r: any) => {
            if (r.status) {
              this._swal.show({
                title: '!Tarea completada con éxito!',
                text: 'Acta de recepción creada con éxito.',
                icon: 'success',
                showCancel: false,
                timer: 1000,
              });
              this.router.navigateByUrl('/inventario/acta-recepcion');
            } else {
              this._swal.hardError();
            }
          },
          (error) => {
            this._swal.hardError();
          },
        );
      };
      this._swal.swalLoading(
        'Si ya verificaste la información y estás de acuerdo, por favor procede.',
        request,
      );
    } else {
      this._swal.incompleteError();
    }
  }

  onFileChanged(event, i) {
    if (event.target.files.length == 1) {
      let file = event.target.files[0];
      const types = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'Solo se permiten archivos PDF, PNG, JPG y JPEG',
        });
        return null;
      }
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        let invoice = this.invoices.controls[i];
        invoice.patchValue({
          Archivo_Factura: base64,
          type: file.type,
        });
      });
    }
  }
}

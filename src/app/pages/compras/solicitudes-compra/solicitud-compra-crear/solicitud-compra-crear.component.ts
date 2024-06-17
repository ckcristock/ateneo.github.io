import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { Observable, OperatorFunction, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { consts } from 'src/app/core/utils/consts';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';
import { NgIf, NgFor } from '@angular/common';
import { PlaceholderFormComponent } from '../../../../components/placeholder-form/placeholder-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductNameComponent } from '@shared/components/product-name/product-name.component';
@Component({
  selector: 'app-solicitud-compra-crear',
  templateUrl: './solicitud-compra-crear.component.html',
  styleUrls: ['./solicitud-compra-crear.component.scss'],
  standalone: true,
  imports: [
    MatAutocompleteModule,
    PlaceholderFormComponent,
    NgIf,
    CabeceraComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    TextFieldModule,
    NgbTypeahead,
    ProductNameComponent,
  ],
})
export class SolicitudCompraCrearComponent implements OnInit {
  @Input('dataEdit') dataEdit;
  @Input('id') id;
  @Input('title') title = 'Nueva solicitud de compra';
  form: FormGroup;
  loading: boolean;
  categories: any[] = [];
  searching: boolean;
  searchFailed: boolean;
  masks = consts;
  path: string;
  today = new Date();
  productDelete: any[] = [];
  datosCabecera = {
    Titulo: '',
    Fecha: '',
    Codigo: '',
    CodigoFormato: '',
  };
  productsForInput: any[] = [];
  varTitles: any[] = [];
  constructor(
    private fb: FormBuilder,
    private _solicitudesCompra: SolicitudesCompraService,
    private _swal: SwalService,
    private router: Router,
    private _consecutivos: ConsecutivosService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.datosCabecera.Fecha = !this.dataEdit && !this.id ? new Date() : this.dataEdit?.created_at;
    this.datosCabecera.Titulo = this.title ?? 'Nueva solicitud de compra';
    this.loading = true;
    this.getCategoryForSelect();
    this.createForm();
    await this.getConsecutivo();
    this.loading = false;
  }

  async getConsecutivo() {
    await this._consecutivos
      .getConsecutivo('purchase_requests')
      .toPromise()
      .then((r: any) => {
        this.datosCabecera.CodigoFormato = r.data.format_code;
        if (!this.dataEdit && !this.id) {
          this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato });
          let con = this._consecutivos.construirConsecutivo(r.data);
          this.datosCabecera.Codigo = con;
        } else {
          this.datosCabecera.Codigo = this.dataEdit.code;
        }
      });
  }

  getCategoryForSelect() {
    this._solicitudesCompra.getCategoryForSelect().subscribe((res: any) => {
      this.categories = res.data;
    });
  }

  validateProducts() {
    if (this.products.controls.length > 0) {
      this._swal
        .show({
          icon: 'warning',
          title: 'Productos en lista',
          text: 'Ya has agregado productos a la lista, si cambias este valor se vaciará la lista de productos.',
        })
        .then((r) => {
          if (r.isConfirmed) {
            this.products.value.forEach((product) => {
              this.productDelete.push(product.id);
            });

            this.products.clear();
          }
        });
    }
  }

  get categoryId() {
    return this.form.get('category_id');
  }

  createForm() {
    this.form = this.fb.group({
      id: this.dataEdit && this.id ? this.dataEdit.id : '',
      category_id: [this.dataEdit ? this.dataEdit.category_id : null, Validators.required],
      expected_date: [this.dataEdit ? this.dataEdit.expected_date : null, Validators.required],
      observations: this.dataEdit ? this.dataEdit.observations : null,
      code: [this.dataEdit ? this.dataEdit.code : this.datosCabecera.Codigo],
      format_code: [this.dataEdit ? this.dataEdit.format_code : this.datosCabecera.CodigoFormato],
      products: this.fb.array([], Validators.required),
    });
    this.form.get('category_id').valueChanges.subscribe((v) => {
      this.validateProducts();
      this.getProductsbyCategory();
    });
    if (this.dataEdit) {
      this.varTitles = this.dataEdit.variables;
      this.dataEdit.product_purchase_request.forEach((product) => {
        this.addProduct(product, true);
      });
    }
  }

  getProductsbyCategory() {
    this.emitProductValue.pipe(debounceTime(300)).subscribe({
      next: (val) => {
        this._solicitudesCompra
          .getProducts({ search: val, category_id: this.form.get('category_id').value })
          .subscribe({
            next: (res: any) => {
              this.productsForInput = res.productos;
              this.varTitles = res.variables;
              this.searching = false;
            },
          });
      },
    });
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this._solicitudesCompra
          .getProducts({ search: term, category_id: this.form.get('category_id').value })
          .pipe(
            tap((results) => {
              if (results.length === 0) {
                this.searchFailed = true;
              } else {
                this.searchFailed = false;
              }
            }),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }),
          ),
      ),
      tap(() => (this.searching = false)),
    );

  formatter = (x: any) => x.name;
  getProductById(id) {
    return this.productsForInput.find((x) => x.product_id == id);
  }
  addProduct(prod, edit, input: any = null) {
    this.getProductById(prod);
    if (
      !this.products.value.some((x) => x.product_id == (edit ? prod.product_id : prod.Id_Producto))
    ) {
      let product = this.fb.group({
        id: [edit ? prod.id : ''],
        product_id: [edit ? prod.product_id : prod.Id_Producto],
        reference: [edit ? prod.product.Referencia : prod.Referencia],
        name: [edit ? prod.name : prod.Nombre_Comercial],
        general: [edit ? prod.product.Nombre_General : prod.Nombre_General],
        ammount: [edit ? prod.ammount : '1', Validators.min(1)],
        unit: [edit ? prod.product.unit?.name : prod.unit?.name],
        variables: [prod.variables],
      });
      this.products.push(product);
    } else {
      this._swal.show({
        icon: 'error',
        title: 'Elemento duplicado',
        text: 'Ya has agregado este producto',
        showCancel: false,
      });
    }
    if (!edit) {
      input.value = '';
    }
  }
  emitProductValue = new Subject();

  getSearchProduct(value: string) {
    this.searching = true;
    this.emitProductValue.next(value);
  }

  get products() {
    return this.form.get('products') as FormArray;
  }

  deleteProduct(index: number) {
    if (this.dataEdit && this.id) {
      this.productDelete.push(this.products.value[index].id);
    }
    this.products.removeAt(index);
  }

  savePurchaseRequest() {
    if (this.form.valid) {
      const data = {
        ...this.form.value,
        products_delete: this.productDelete,
      };
      const request = (resolve: any) => {
        this._solicitudesCompra.savePurchaseRequest(data).subscribe({
          next: (data: any) => {
            this.router.navigateByUrl('/compras/solicitud');
            resolve(true);
            let swal = {
              icon: 'success',
              title: '!Tarea completada!',
              text:
                'La solicitud de compra ha sido ' +
                (this.form.value.id ? 'actualizada' : 'creada') +
                ' con éxito.',
              timer: null,
              showCancel: false,
            };
            this._swal.show(swal);
          },
          error: (error: HttpErrorResponse) => {
            let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
            if (error.error.error) {
              errorMessage = error.error.error;
              this._swal.hardError();
            } else if (error.error.errors) {
              let errorMessages: string[] = [];
              for (const field in error.error.errors) {
                errorMessages.push(error.error.errors[field]);
              }
              const formattedErrorMessage = errorMessages.join('<br/>');
              this._swal.incompleteError(formattedErrorMessage);
            }
          },
        });
      };
      this._swal.swalLoading(
        'Si ya verificaste la información y estás de acuerdo, por favor procede.',
        request,
      );
    } else {
      this._swal.incompleteError();
    }
  }

  get category_id_valid() {
    return this.form.get('category_id').invalid && this.form.get('category_id').touched;
  }

  get expected_date_valid() {
    return this.form.get('expected_date').invalid && this.form.get('expected_date').touched;
  }
}

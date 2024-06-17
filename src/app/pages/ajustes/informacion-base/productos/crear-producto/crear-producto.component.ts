import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CatalogoService } from '../../catalogo/catalogo.service';
import { SwalService } from '../../services/swal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { ProductoService } from '../producto.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { filter, skip, skipWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { consts } from 'src/app/core/utils/consts';
import { ReloadButtonComponent } from '../../../../../components/reload-button/reload-button.component';
import { InputPositionDirective } from '../../../../../core/directives/input-position.directive';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadImageComponent } from '../../../../../shared/components/load-image/load-image.component';

import { PlaceholderFormComponent } from '../../../../../components/placeholder-form/placeholder-form.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss'],
  standalone: true,
  imports: [
    PlaceholderFormComponent,
    FormsModule,
    ReactiveFormsModule,
    LoadImageComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    InputPositionDirective,
    ReloadButtonComponent,
    NgxCurrencyDirective,
    MatCheckboxModule,
  ],
})
export class CrearProductoComponent implements OnInit {
  @Input('title') title = 'Agregar producto';
  @Input('data') data;
  @Input('id') id;
  form: UntypedFormGroup;
  packagings: any[] = [];
  masks = consts;
  unidades_medida: any[] = [];
  categories: any[] = [];
  taxes: any[] = [];
  subcategories: any[] = [];
  imageProduct: string | SafeUrl = '';
  loading: boolean;
  generalName = {
    Nombre_Comercial: '',
    Unidad_Medida: '',
    Referencia: '',
  };
  isLoadImage: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private _catalogo: CatalogoService,
    private _swal: SwalService,
    private _producto: ProductoService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createForm();
    this.getData();
  }

  fillInForm() {
    this.form.patchValue({
      Id_Producto: this.data.Id_Producto,
      Id_Categoria: this.data.Id_Categoria,
      Id_Subcategoria: this.data.Id_Subcategoria,
      Nombre_Comercial: this.data.Nombre_Comercial,
      Nombre_General: this.data.Nombre_General,
      Referencia: this.data.Referencia,
      Unidad_Medida: this.data.Unidad_Medida,
      //Precio: this.data.Precio,
      impuesto_id: this.data.impuesto_id,
      Codigo_Barras: this.data.Codigo_Barras,
      Imagen: this.data.Imagen,
    });
    this.imageProduct = this.data.Imagen;
    this.data.variables.forEach((element) => {
      if (element.category_variables_id) {
        this.category_variables.push(this.addVariables(element, true, 'cat'));
      } else if (element.subcategory_variables_id) {
        this.subcategory_variables.push(this.addVariables(element, true, 'subcat'));
      }
    });
  }

  getData() {
    this.loading = true;
    this._producto
      .getDataCreate()
      .toPromise()
      .then((res: any) => {
        if (res) {
          this.packagings = res.data.packagings;
          this.unidades_medida = res.data.units;
          this.categories = res.data.categories;
          this.taxes = res.data.taxes;
        }
        this.loading = false;
        if (this.id && this.data) {
          this.fillInForm();
          let cat = this.categories.find((x) => x.value == this.data.Id_Categoria);
          if (cat) this.subcategories = cat.subcategories;
        }
      });
  }

  createForm() {
    this.form = this.fb.group({
      Id_Producto: [''],
      Id_Categoria: ['', Validators.required],
      Id_Subcategoria: ['', Validators.required],
      Nombre_Comercial: ['', Validators.required],
      Nombre_General: ['', Validators.required],
      Unidad_Medida: ['', Validators.required],
      Codigo_Barras: [''],
      Referencia: [''],
      impuesto_id: ['', Validators.required],
      //Precio: ['', Validators.required],
      Imagen: [''],
      typeFile: [''],
      category_variables: this.fb.array([]),
      subcategory_variables: this.fb.array([]),
    });
    this.form
      .get('Id_Categoria')
      .valueChanges.pipe(skip(this.id ? 1 : 0))
      .subscribe((v) => {
        this.subcategory_variables.clear();
        let cat = this.categories.find((x) => x.value == v);
        this.subcategories = cat.subcategories;
        this.getVariablesCat(v);
      });
    this.form
      .get('Id_Subcategoria')
      .valueChanges.pipe(skip(this.id ? 1 : 0))
      .subscribe((v) => {
        this.getVariablesSubCat(v);
      });
  }

  laodingReload: boolean;

  async reload() {
    this.laodingReload = true;
    this.getVariablesCat(this.form.get('Id_Categoria').value);
    await this.getVariablesSubCat(this.form.get('Id_Subcategoria').value);
    this.laodingReload = false;
  }

  getVariablesCat(value) {
    this.generalName = {
      Nombre_Comercial: '',
      Unidad_Medida: '',
      Referencia: '',
    };
    this._producto.getVariablesCat(value).subscribe((res: any) => {
      this.category_variables.clear();
      res.data.forEach((element) => {
        if (!element.reception) {
          this.category_variables.push(this.addVariables(element));
          this.generalName[element.label] = '';
        }
      });
    });
  }

  async getVariablesSubCat(value) {
    this.generalName = {
      Nombre_Comercial: '',
      Unidad_Medida: '',
      Referencia: '',
    };
    await this._producto
      .getVariablesSubCat(value)
      .toPromise()
      .then((res: any) => {
        this.subcategory_variables.clear();
        res.data.forEach((element) => {
          if (!element.reception) {
            this.subcategory_variables.push(this.addVariables(element));
            this.generalName[element.label] = '';
          }
        });
      });
  }

  addVariables(element, edit = false, type = '') {
    return this.fb.group({
      id: [edit ? element.id : ''],
      temporalId: [element.id],
      subcategory_variables_id: [
        edit ? element.subcategory_variables_id : element.subcategory_id ? element.id : null,
      ],
      category_variables_id: [
        edit ? element.category_variables_id : element.category_id ? element.id : null,
      ],
      valor: [edit ? element.valor : '', Validators.required],
      label: [
        edit && type == 'cat'
          ? element.category_variables.label
          : edit && type == 'subcat'
            ? element.sub_category_variables.label
            : element.label,
      ],
      type: [
        edit && type == 'cat'
          ? element.category_variables.type
          : edit && type == 'subcat'
            ? element.sub_category_variables.type
            : element.type,
      ],
      required: [
        (edit && type == 'cat'
          ? element.category_variables.required
          : edit && type == 'subcat'
            ? element.sub_category_variables.required
            : element.required) == 'Si'
          ? true
          : false,
      ],
    });
  }

  get subcategory_variables() {
    return this.form.get('subcategory_variables') as UntypedFormArray;
  }

  get category_variables() {
    return this.form.get('category_variables') as UntypedFormArray;
  }

  onFileSelected(event) {
    this.isLoadImage = false;
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
        return null;
      }
      this.isLoadImage = true;
      this.imageProduct = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(event.target.files[0]),
      );
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.form.patchValue({
          Imagen: base64,
          typeFile: file.type,
        });
      });
    }
  }

  saveProductos() {
    console.log(this.form);
    if (this.form.valid) {
      const data = this.form.value;
      const request = () => {
        this._producto.save(data).subscribe({
          next: () => {
            this._swal.show({
              icon: 'success',
              title: 'Operacion exitosa',
              text: 'El producto ha sido registrado con éxito.',
              timer: 1000,
              showCancel: false,
            });
            this.router.navigateByUrl('/ajustes/informacion-base/catalogo');
          },
          error: (error) => {
            this._swal.show({
              icon: 'error',
              title: 'Se presentó un error!',
              text: error.message,
              showCancel: false,
            });
          },
        });
      };
      const title = `Vamos a ${data.Id_Producto ? 'editar un' : 'guardar un nuevo'} producto.`;
      this._swal.swalLoading(title, request);
    } else {
      this._swal.incompleteError();
    }
  }

  onHandleCheckbox(event: any, type: string, item = null) {
    let value = '';
    let key = '';
    if (type === 'cat' || type === 'subcat') {
      key = item?.get('label').value;
      if (item && this.generalName.hasOwnProperty(key)) {
        value = event.checked ? item.get('valor').value : '';
      }
    } else {
      switch (type) {
        case 'nombre':
          key = 'Nombre_Comercial';
          value = event.checked ? this.form.get(key).value : '';
          break;
        case 'medida':
          key = 'Unidad_Medida';
          const measure = this.unidades_medida.find((x) => x.value === this.form.get(key).value);
          value = event.checked ? measure.text : '';
          break;
        case 'referencia':
          key = 'Referencia';
          value = event.checked ? this.form.get(key).value : '';
          break;
      }
    }
    if (key) {
      this.generalName[key] = value;
      this.buildGeneralName(this.generalName);
    }
  }

  buildGeneralName(obj) {
    let result = '';
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        result += obj[key] + ' ';
      }
    }
    result = result
      .trim()
      .replace(/ +(?= )/g, '')
      .toUpperCase();
    this.form.get('Nombre_General')?.setValue(result);
  }
}

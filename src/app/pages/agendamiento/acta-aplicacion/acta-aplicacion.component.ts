import { Component, OnInit, ViewChild } from '@angular/core';
import { ActaAplicacionService } from '../acta-aplicacion.service';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { functionsUtils } from '../../../core/utils/functionsUtils';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ModalBasicComponent } from '../../../components/modal-basic/modal-basic.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-acta-aplicacion',
  templateUrl: './acta-aplicacion.component.html',
  styleUrls: ['./acta-aplicacion.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatInputModule,
    TextFieldModule,
    NgIf,
    ModalBasicComponent,
    NotDataComponent,
  ],
})
export class ActaAplicacionComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild('modalDocuments') modalDocuments: any;

  form: UntypedFormGroup;

  loading = false;
  Cargando = false;

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  };

  filtro: any = {
    name: '',
  };

  people: any[] = [];
  diagnostics: any[] = [];
  cups: any[] = [];
  ListaProductos: any[] = [];
  productsAdd: any[] = [];
  productS: any[] = [];
  productList: any[] = [];

  fileString: any = '';
  file: any = '';
  type: any = '';

  //files: File[] = []; // Para Documentos legales
  //fileArr: any[] = [];

  //myFiles: string[] = [];

  constructor(
    private router: Router,
    private _user: UserService,
    private fb: UntypedFormBuilder,
    private _acta: ActaAplicacionService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getPeople();
    this.getDiagnostics();
    this.getCups();
  }

  getDiagnostics() {
    let params = {
      xxx: 'Dotacion_EPP',
    };
    this._acta.getDiagnostics(params).subscribe((data: any) => {
      this.diagnostics = data.data;
    });
  }

  getCups() {
    let params = {
      xxx: 'Dotacion_EPP',
    };
    this._acta.getCups(params).subscribe((data: any) => {
      this.cups = data.data;
    });
  }

  createForm() {
    this.form = this.fb.group({
      patient_id: ['', Validators.required],
      person_id: [''],
      date: ['', Validators.required],
      cups_id: ['', Validators.required],
      diagnostic: ['', Validators.required],
      diagnosticS: [''],
      observation: [''],
      file: [''],
      type: [''],
      productSelected: this.fb.array([]),
    });
  }
  nombreFile: any;
  fileActa(event) {
    if (event.target.files[0]) {
      this.nombreFile = event.target.files[0].name;
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
      });
    }
  }

  productControl(event) {
    let groupSelect = this.form.get('productSelected') as UntypedFormArray;
    event.productSelected.forEach((element) => {
      let group = this.fb.group({
        Nombre_Comercial: [element.Nombre_Comercial],
        Codigo_Cum: [element.Codigo_Cum],
        lote: [element.Lote],
        amount: [''],
        file1: [''],
        file2: [''],
        product_id: [element.Id_Producto],
      });
      groupSelect.push(group);
      this.loading = false;
      return group;
    });
  }
  file1(event, data, i) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
        this.form.get('productSelected').value[i].file1 = this.fileString;
      });
    }
  }

  file2(event, data, i) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
        this.form.get('productSelected').value[i].file2 = this.fileString;
      });
    }
  }

  selectedProduct(event: any, p) {
    let selected = {
      Nombre_Comercial: event.target.Nombre_Comercial,
      Codigo_Cum: event.target.Codigo_Cum,
      Lote: event.target.Lote,
      Id_Producto: event.target.Id_Producto,
    };
    if (event.target.checked) {
      // Add the new value in the selected options
      this.productS.push(selected);
    } else {
      // removes the unselected option
      this.productS = this.productS.filter((selected) => selected.id !== event.target.id);
    }
  }

  save() {
    Swal.fire({
      title: '¿Seguro?',
      text: 'Va a generar una nueva Acta',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Si, Hazlo!',
    }).then((result) => {
      if (result.value) {
        this.saveActa();
      }
    });
  }

  saveActa() {
    let file = this.form.value.file;
    file = this.fileString;
    let type = this.type;
    let person_id = this._user.user.person.company_worked.id;

    //  let person_id = this.form.value.person_id.value;
    this.form.patchValue({
      person_id,
      file,
      type,
    });
    this._acta.saveActa(this.form.value).subscribe((res: any) => {
      Swal.fire({
        icon: 'success',
        title: res.data,
        text: 'Acta creada satisfactoriamente',
      });
      this.form.reset();
      this.router.navigate(['/agendamiento/lista-acta-aplicacion']);

      //  this.getDisciplinaryProcess();
      // this.modal.hide();
    });
  }

  addProduct() {
    this.loading = false;
    let forma = this.form.value;
    forma.productSelected = this.productS;
    this.productList = forma.productSelected;
    this.productList.push(this.productControl(forma));
    this.modal.hide();
    this.productS = [];
  }

  verF() {}

  get getProductList() {
    return this.form.get('productSelected') as UntypedFormArray;
  }

  deletedProduct(i) {
    this.getProductList.removeAt(i);
  }

  getPeople() {
    this._acta.getPeople().subscribe((r: any) => {
      this.people = r.data;
    });
  }

  listarProducto(page = 1) {
    this.loading = true;
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtro,
      tipo: 'Dotacion_EPP',
      //company_id: this.user.person.company_worked.id,
    };
    this.modal.show();
    this._acta.GetProducts(params).subscribe((data: any) => {
      this.ListaProductos = data.data.data;
      this.Cargando = false;
    });
  }

  close() {
    this.productS = [];
    this.modal.hide();
    this.loading = false;
  }
}

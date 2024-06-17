import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { DataDinamicService } from 'src/app/services/data-dinamic.service';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ConfiguracionEmpresaService } from '../../configuracion-empresa.service';
import { SwalService } from '../../../../services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ImagePipe } from 'src/app/core/pipes/image.pipe';

@Component({
  selector: 'app-datos-basicos-empresa',
  templateUrl: './datos-basicos-empresa.component.html',
  styleUrls: ['./datos-basicos-empresa.component.scss'],
  standalone: true,
  imports: [
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ImagePipe,
  ],
})
export class DatosBasicosEmpresaComponent implements DoCheck {
  @Output() update = new EventEmitter();
  @Input('data') set changeData(newData) {
    if (newData) {
      this.company = newData;
      this.getBasicData();
    }
  }
  company: any = [];
  form: UntypedFormGroup;
  file: string;
  loading: boolean = true;
  fileString: string | ArrayBuffer = '';
  documents_types: any = [];

  loadingModal = false;

  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: UntypedFormBuilder,
    private _modal: ModalService,
    private _swal: SwalService,
    private _data: DataDinamicService,
  ) {}
  ngDoCheck() {
    if (this.company.id) {
      this.loading = false;
    }
  }

  getDocumentsTypes() {
    this.loadingModal = true;
    this._data.getTypeDocuments().subscribe((res: any) => {
      this.documents_types = res.data;
      this.loadingModal = false;
    });
  }

  updateData() {
    this.update.emit();
  }

  openModal(modal) {
    this.getDocumentsTypes();
    this._modal.open(modal, 'lg');
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.company.id],
      name: ['', Validators.required],
      document_type: ['', Validators.required],
      tin: ['', Validators.required],
      dv: ['', Validators.required],
      creation_date: ['', Validators.required],
      email_contact: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      logo: [''],
    });
  }

  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
      });
    }
  }

  getBasicData() {
    this.createForm();
    this.form.patchValue({
      id: this.company.id,
      logo: this.company.logo,
      name: this.company.name,
      document_type: this.company.document_type,
      tin: this.company.tin,
      dv: this.company.dv,
      creation_date: this.company.creation_date,
      email_contact: this.company.email_contact,
      phone: this.company.phone,
    });
    this.fileString = this.company.logo;
  }

  saveBasicData() {
    const request = () => {
      let body = { ...this.form.value };
      body['logo'] = this.file;
      this._configuracionEmpresaService.saveCompanyData(body).subscribe((res: any) => {
        this._modal.close();
        this.updateData();
        this.getBasicData();
        this._swal.show({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Datos actualizados correctamente',
          timer: 1000,
          showCancel: false,
        });
      });
    };
    this._swal.swalLoading('', request);
  }
}

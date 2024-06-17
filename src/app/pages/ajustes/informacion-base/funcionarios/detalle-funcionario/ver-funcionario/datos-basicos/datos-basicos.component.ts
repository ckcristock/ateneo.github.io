import { Component, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { consts } from 'src/app/core/utils/consts';
import { DatosBasicosService } from './datos-basicos.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { Subscription } from 'rxjs';
import { PersonDataService } from '../../../create/personData.service';
import { Person } from 'src/app/core/models/person.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../../services/swal.service';
import { UserDetail } from '../../interfaces/detalle.interface';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { UpperCasePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.component.html',
  styleUrls: ['./datos-basicos.component.scss'],
  standalone: true,
  imports: [
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    UpperCasePipe,
    DecimalPipe,
    CapitalLetterPipe,
  ],
})
export class DatosBasicosComponent implements OnInit {
  @Input() userDetail: Partial<UserDetail> = {};
  @Output() updateSuccess: EventEmitter<void> = new EventEmitter();

  @ViewChild('modal') modal: any;
  estados = consts.maritalStatus;
  degrees = consts.degree;
  $person: Subscription;
  form: UntypedFormGroup;
  loading: boolean;
  file: any = '';
  fileString: any = '';
  constructor(
    private fb: UntypedFormBuilder,
    private basicDataService: DatosBasicosService,
    private activatedRoute: ActivatedRoute,
    private _person: PersonDataService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) {}
  person: Person;
  titleFile = 'Selecciona imagen';

  ngOnInit(): void {
    this.createForm();
    this.setUserDataToForm();
    this.getBasicsData();
    this.$person = this._person.person.subscribe((r) => {
      this.person = r;
    });
  }

  private setUserDataToForm(): void {
    this.form.patchValue({
      address: this.userDetail?.address,
      cell_phone: this.userDetail?.cell_phone,
      birth_date: this.userDetail?.birth_date,
      degree: this.userDetail?.degree,
      email: this.userDetail?.email,
      first_name: this.userDetail?.first_name,
      second_name: this.userDetail?.second_name,
      first_surname: this.userDetail?.first_surname,
      second_surname: this.userDetail?.second_surname,
      identifier: this.userDetail?.identifier,
      marital_status: this.userDetail?.marital_status,
      gener: this.userDetail?.gener,
      visa: this.userDetail?.visa,
      passport_number: this.userDetail?.passport_number,
      title: this.userDetail?.title,
      signature: this.userDetail?.signature,
    });
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService
      .open(confirm, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
        scrollable: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  private getDismissReason(reason: any) {}
  hideModal() {
    this.getBasicsData();
  }

  getBasicsData() {
    this.loading = true;
    this.file = this.userDetail?.image;
    this.fileString = this.userDetail?.image;
    this.userDetail?.signature
      ? (this.titleFile = 'El funcionario ya tiene firma cargada')
      : 'Selecciona imagen';
    this.loading = false;
  }

  createForm() {
    this.form = this.fb.group({
      image: [''],
      first_name: ['', Validators.required],
      second_name: [''],
      first_surname: ['', Validators.required],
      second_surname: [''],
      identifier: ['', Validators.required],
      birth_date: ['', Validators.required],
      address: ['', Validators.required],
      degree: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
      ],
      gener: ['', Validators.required],
      marital_status: ['', Validators.required],
      cell_phone: ['', Validators.required],
      visa: [''],
      passport_number: [''],
      title: [''],
      signature: [],
    });
  }

  onFileChangedSignature(event) {
    if (event.target.files.length == 1) {
      let file = event.target.files[0];
      const maxWidth = 800;
      let maxHeight = 450;
      this.validarDimensionesImagen(file, maxWidth, maxHeight)
        .then(() => {
          const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
          if (!types.includes(file.type)) {
            this._swal.show({
              icon: 'error',
              title: 'Error de archivo',
              showCancel: false,
              text: 'El tipo de archivo no es válido',
            });
            return null;
          }
          this.titleFile = event.target.files[0].name;
          functionsUtils.fileToBase64(file).subscribe((base64) => {
            this.form.patchValue({
              signature: base64,
            });
          });
        })
        .catch((error: string) => {
          console.error(error);
          this._swal.show({
            icon: 'error',
            title: 'Error de archivo',
            showCancel: false,
            text: 'La imagen no tiene las dimensiones solicitadas (800px de ancho por 450px de alto)',
          });
        });
    }
  }

  validarDimensionesImagen(file: File, maxWidth: number, maxHeight: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          if (width == maxWidth && height == maxHeight) {
            resolve();
          } else if (file.type == 'image/svg+xml') {
            resolve();
          } else {
            reject(`Las dimensiones de la imagen deben ser iguales a ${maxWidth}x${maxHeight}`);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  get id(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  get first_name_valid() {
    return this.form.get('first_name').invalid && this.form.get('first_name').touched;
  }

  get first_surname_valid() {
    return this.form.get('first_surname').invalid && this.form.get('first_surname').touched;
  }

  get image_valid() {
    return this.form.get('image').touched && !this.fileString;
  }
  get identifier_valid() {
    return this.form.get('identifier').invalid && this.form.get('identifier').touched;
  }
  get names_valid() {
    return this.form.get('names').invalid && this.form.get('names').touched;
  }
  get subnames_valid() {
    return this.form.get('subnames').invalid && this.form.get('subnames').touched;
  }
  get email_valid() {
    return this.form.get('email').invalid && this.form.get('email').touched;
  }
  get birth_date_valid() {
    return this.form.get('birth_date').invalid && this.form.get('birth_date').touched;
  }
  get address_valid() {
    return this.form.get('address').invalid && this.form.get('address').touched;
  }
  get gener_valid() {
    return this.form.get('gener').invalid && this.form.get('gener').touched;
  }
  get cell_phone_valid() {
    return this.form.get('cell_phone').invalid && this.form.get('cell_phone').touched;
  }
  get marital_status_valid() {
    return this.form.get('marital_status').invalid && this.form.get('marital_status').touched;
  }
  onFileChanged(event) {
    if (event.target.files.length == 1) {
      let file = event.target.files[0];
      let maxWidth = 800;
      let maxHeight = 800;
      this.validarDimensionesImagen(file, maxWidth, maxHeight)
        .then(() => {
          const types = ['image/png', 'image/jpeg', 'image/jpg'];
          if (!types.includes(file.type)) {
            this._swal.show({
              icon: 'error',
              title: 'Error de archivo',
              showCancel: false,
              text: 'El tipo de archivo no es válido',
            });
            return null;
          }
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event) => {
            this.fileString = (<FileReader>event.target).result;
          };
          functionsUtils.fileToBase64(file).subscribe((base64) => {
            this.form.patchValue({
              image: base64,
            });
            this.file = base64;
          });
        })
        .catch((error: string) => {
          console.error(error);
          this._swal.show({
            icon: 'error',
            title: 'Error de archivo',
            showCancel: false,
            text: 'La imagen no tiene las dimensiones solicitadas (800px de ancho por 800px de alto)',
          });
        });
    }
  }

  guardar() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.image_valid) {
      return false;
    }
    this.form.patchValue({
      image: this.file,
    });
    const request = () => {
      this.basicDataService.updateBasicData(this.form.value, this.id).subscribe((res) => {
        this.modalService.dismissAll();
        this.updateSuccess.emit();
        this._swal.show({
          title: 'Proceso finalizado',
          text: 'Se han actualizado los cambios correctamente.',
          icon: 'success',
          showCancel: false,
          timer: 1000,
        });
        this.basicDataService.datos$.emit();
      });
      this.person.image = this.file;
    };
    this._swal.swalLoading('', request);
  }
}

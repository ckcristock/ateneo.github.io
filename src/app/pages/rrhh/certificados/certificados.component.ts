import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonService } from '../../ajustes/informacion-base/services/person/person.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { CertificadosService } from './certificados.service';
import { functionsUtils } from '../../../core/utils/functionsUtils';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { GlobalService } from '@shared/services/global.service';
import { Observable } from 'rxjs';
import { InputPositionDirective } from '../../../core/directives/input-position.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatRadioModule } from '@angular/material/radio';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteFcComponent } from '../../../components/autocomplete-fc/autocomplete-fc.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteMdlComponent } from '../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { CesantiasComponent } from './cesantias/cesantias.component';
import { CertificadosListComponent } from './certificados-list/certificados-list.component';
import { HeaderButtonComponent } from '../../../shared/components/standard-components/header-button/header-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    HeaderButtonComponent,
    CertificadosListComponent,
    CesantiasComponent,
    NgIf,
    AutocompleteMdlComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    AutocompleteFcComponent,
    MatInputModule,
    TextFieldModule,
    NgFor,
    MatRadioModule,
    NgxCurrencyDirective,
    InputPositionDirective,
    AsyncPipe,
  ],
})
export class CertificadosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('laboralchild') laboralChild: any;
  @ViewChild('cesantiaschild') cesantiaschild: any;
  formLaboral: UntypedFormGroup;
  formCesantias: UntypedFormGroup;
  matPanel = false;
  closeResult = '';
  people$ = new Observable();
  peopleAll$ = new Observable();
  pdfCargado: boolean = false;
  pdfString: any = '';
  pdfType: any = '';
  pdfFyle: any = '';
  reason_withdrawal: any[] = [];
  requisitos: any = '';
  filtroLaboral: any = {
    name: '',
  };
  filtroCesantias: any = {
    name: '',
  };
  constructor(
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private _certificados: CertificadosService,
    private _swal: SwalService,
    private _people: PersonService,
    readonly urlFiltersService: UrlFiltersService,
    private readonly globalService: GlobalService,
  ) {}

  ngOnInit(): void {
    this.createFormLaboral();
    this.createFormCesantias();
    this.people$ = this.globalService.getPeople$;
    this.peopleAll$ = this.globalService.getAllPeople$;
    this.getReasonLayoffs();
  }

  openClose(): void {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }

  getRequisitos(r: string): void {
    this.requisitos = r;
  }
  //certificado laboral requiere funcionario tiene vigencia de 30 días el boton de descargar pero se muestran todos con paginacion, se pide informacion a mostrar dirigido a motivo de la solicitud

  public openConfirm(confirm: TemplateRef<any>): void {
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        () => {
          this.closeResult = `Dismissed ${this.getDismissReason()}`;
        },
      );
  }
  private getDismissReason(): void {
    this.requisitos = '';
    this.pdfCargado = false;
    this.pdfFyle = '';
    this.formCesantias.get('document').setValue('');
    this.formLaboral.reset();
    this.formCesantias.reset();
  }

  getReasonLayoffs(): void {
    this._certificados.getReasonLayoffs().subscribe((res: any) => {
      this.reason_withdrawal = res.data;
    });
  }
  peopleFiltro: any;

  newLaboral(): void {
    this._certificados.createNewWorkCertificate(this.formLaboral.value).subscribe(
      (res: any) => {
        if (res.data) {
          this.modalService.dismissAll();
          this._swal.show({
            title: 'Certificado generado con éxito',
            icon: 'success',
            text: '',
            timer: 1000,
            showCancel: false,
          });
          this.laboralChild.getWorkCertificates();
        } else if (res.err) {
          this._swal.show({
            title: 'Error',
            icon: 'error',
            text: res.err,
            showCancel: false,
          });
        }
      },
      (error: any) => {
        this._swal.show({
          title: 'Error',
          icon: 'error',
          text: error.data.err,
          showCancel: false,
        });
      },
    );
  }

  newCesantia(): void {
    console.log(this.formCesantias.value);
    if (this.formCesantias.invalid) {
      this._swal.incompleteError();
      return;
    }
    const request = () => {
      this._certificados.createNewLayoffsCertificate(this.formCesantias.value).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.modalService.dismissAll();
            this._swal.show({
              title: 'Solicitud generada con éxito',
              icon: 'success',
              text: '',
              timer: 1000,
              showCancel: false,
            });
            this.cesantiaschild.getLayoffsCertificates();
          } else if (res.err) {
            this._swal.show({
              title: 'Error',
              icon: 'error',
              text: res.err,
              showCancel: false,
            });
          }
        },
        error: (error: any) => {
          this._swal.show({
            title: 'Error',
            icon: 'error',
            text: error.data.err,
            showCancel: false,
          });
        },
      });
    };
    this._swal.swalLoading('Vamos a generar tu solicitud', request);
  }

  createFormLaboral(): void {
    this.formLaboral = this.fb.group({
      information: ['', Validators.required],
      person_id: [null, Validators.required],
      reason: ['', Validators.required],
      addressee: [''],
    });
  }

  optionSelected(value) {
    this.formCesantias.get('person_id').setValue(value);
  }

  createFormCesantias(): void {
    this.formCesantias = this.fb.group({
      reason_withdrawal: ['', Validators.required],
      person_id: [null, Validators.required],
      reason: ['', Validators.required],
      document: ['', Validators.required],
      file_name: [''],
      monto: ['', Validators.required],
      valormonto: ['', Validators.required],
    });
    this.formCesantias.get('monto').valueChanges.subscribe((r) => {
      r == 'parcial'
        ? this.formCesantias.get('valormonto').enable()
        : this.formCesantias.get('valormonto').disable();
    });
  }

  onFileChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files[0]) {
      this.pdfCargado = true;
      const file = input.files[0];
      this.formCesantias.get('file_name').setValue(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event): void => {
        this.pdfString = (<FileReader>event.target).result;
        const type = { ext: this.pdfString };
        this.pdfType = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.pdfFyle = base64;
        this.formCesantias.get('document').setValue(this.pdfFyle);
      });
    }
  }

  get person_is_valid(): boolean {
    return this.formLaboral.get('person_id').invalid && this.formLaboral.get('person_id').touched;
  }
  get person_is_valid2(): boolean {
    return (
      this.formCesantias.get('person_id').invalid && this.formCesantias.get('person_id').touched
    );
  }
}

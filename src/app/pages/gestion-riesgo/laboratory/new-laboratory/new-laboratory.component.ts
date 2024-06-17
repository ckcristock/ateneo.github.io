import { DatePipe, NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { UserService } from 'src/app/core/services/user.service';
import { LaboratoryService } from '../laboratory.service';
import { Observable, of, OperatorFunction } from 'rxjs';
import {
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  first,
  map,
  skip,
  switchMap,
  tap,
} from 'rxjs/operators';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { QueryPatient } from 'src/app/pages/agendamiento/query-patient.service';
import { SetPacienteComponent } from 'src/app/components/paciente/set-paciente/set-paciente.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { SetPacienteComponent as SetPacienteComponent_1 } from '../../../../components/paciente/set-paciente/set-paciente.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'undefined-new-laboratory',
  templateUrl: './new-laboratory.component.html',
  styleUrls: ['./new-laboratory.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgbTypeahead,
    NgIf,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    SetPacienteComponent_1,
    NotDataComponent,
  ],
})
export class NewLaboratoryComponent implements OnInit {
  form: UntypedFormGroup;
  today = new Date().toISOString().slice(0, 10);
  date: { year: number; month: number };
  laboratoriosLugar: any[] = [];
  pacientes: any[] = [];
  diagnosticos: any[] = [];
  profesionales: any[] = [];
  procedimientos: any[] = [];
  contratos: any[] = [];
  cups: any[] = [];
  ips: any;
  public model: any;
  loadingCups: boolean = false;
  searchingCups = false;
  searchFailedCups = false;
  searchingPatient = false;
  searchFailedPatient = false;
  searchingCie10 = false;
  searchFailedCie10 = false;

  fileString: any = '';
  file: any = '';
  filename: any = '';
  type: any = '';

  fileStringDocument: any = '';
  fileDocument: any = '';
  filenameDocument: any = '';
  typeDocument: any = '';
  faltanDatos: boolean = false;

  fileStringConsentimiento: any = '';
  fileConsentimiento: any = '';
  filenameConsentimiento: any = '';
  typeConsentimiento: any = '';
  returnBack: boolean;
  paciente: any;
  constructor(
    private _validatorsService: ValidatorsService,
    private fb: UntypedFormBuilder,
    private _user: UserService,
    private _laboratory: LaboratoryService,
    private _swal: SwalService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private _queryPatient: QueryPatient,
  ) {
    this.ips = this._user.user.person.company_worked.id;
  }

  ngOnInit() {
    this.createForm();
    this._queryPatient.patient.subscribe(async (r) => {
      this.paciente = r.paciente;
      if (!r.paciente.identifier || r.isNew) {
        this.form.patchValue({ patient: '' });
      } else if (!r.isNew) {
        this.form.patchValue({ patient: r.paciente });
      }
      this.form.patchValue({ contract_id: '' });
      let params = {
        eps_id: this.paciente.eps_id,
        regimen_id: this.paciente.regimen_id,
        department_id: this.paciente.department_id,
        type_service: 8,
      };
      this.getContract(params);
    });

    this.getLaboratoriesPlace();
    this.getProfessional();
    //this.getPatients();
  }

  formatter = (paciente: any) => paciente.NombreCompleto;

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingPatient = true)),
      switchMap((term) =>
        this._laboratory.getPatient({ search: term }).pipe(
          tap(() => (this.searchFailedPatient = false)),
          catchError(() => {
            this.searchFailedPatient = true;
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searchingPatient = false)),
    );

  searchCups: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingCups = true)),
      switchMap((term) =>
        this._laboratory.getCups({ search: term, type: 8 }).pipe(
          tap(() => (this.searchFailedCups = false)),
          catchError(() => {
            this.searchFailedCups = true;
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searchingCups = false)),
    );

  formatterCups = (x: any) => x.text;

  searchCie10: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingCie10 = true)),
      switchMap((term) =>
        this._laboratory.getCie10({ search: term }).pipe(
          tap(() => (this.searchFailedCie10 = false)),
          catchError(() => {
            this.searchFailedCie10 = true;
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searchingCie10 = false)),
    );

  formatterCie10 = (x: any) => x.text;

  createForm() {
    this.form = this.fb.group({
      patient: ['', this._validatorsService.required],
      date: [this.today, this._validatorsService.required],
      cie10_id: ['', this._validatorsService.required],
      professional_id: ['', this._validatorsService.required],
      contract_id: ['', this._validatorsService.required],
      cups: [this.cups, this._validatorsService.required],
      laboratory_id: ['', this._validatorsService.required],
      ips_id: [this.ips],
      medical_order: ['', this._validatorsService.required],
      patient_document: ['', this._validatorsService.required],
    });
  }

  deleteCup(id) {
    this.cups.splice(id, 1);
  }

  onFileChanged(event, type) {
    if (event.target.files[0]) {
      let file1 = event.target.files[0];
      const types = ['application/pdf'];
      if (!types.includes(file1.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
        return null;
      }
      this.form.get('medical_order').setValue(file1.name);
      this.filename = file1.name;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file1).subscribe((base64) => {
        this.file = base64;
      });
    }
  }
  onFileChanged2(event, type) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['application/pdf'];
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
        return null;
      }
      this.form.get('patient_document').setValue(file.name);
      this.filenameDocument = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileStringDocument = (<FileReader>event.target).result;
        const type = { ext: this.fileStringDocument };
        this.typeDocument = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.fileDocument = base64;
      });
    }
  }
  onFileChanged3(event, type) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['application/pdf'];
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
        return null;
      }
      this.filenameConsentimiento = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileStringConsentimiento = (<FileReader>event.target).result;
        const type = { ext: this.fileStringConsentimiento };
        this.typeConsentimiento = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.fileConsentimiento = base64;
      });
    }
  }

  getContract(params) {
    this._laboratory.getContracts(params).subscribe((res: any) => {
      this.contratos = res.data;
    });
  }

  getLaboratoriesPlace() {
    this._laboratory.getLaboratoriesPlace().subscribe((res: any) => {
      this.laboratoriosLugar = res.data;
    });
  }

  getProfessional() {
    this._laboratory
      .getProfesionals(this.ips, '131') //codigo de la especialidad de toma de muestras
      .subscribe((resp: any) => {
        this.profesionales = resp.data;
      });
  }

  getCie10(p) {
    let params = {
      search: p,
    };
    this._laboratory.getCie10(params).subscribe((res: any) => {
      this.diagnosticos = res.data;
      console.log(this.diagnosticos);
    });
  }

  createNewLaboratory() {
    console.log(this.form.get('patient').value['id']);
    if (this.form.valid && this.cups.length > 0) {
      let params = {
        ...this.form.value,
        file_order: this.file,
        file_document: this.fileDocument,
        file_cosentimiento: this.fileConsentimiento,
      };
      this._laboratory.createLaboratory(params).subscribe((res: any) => {
        this.router.navigateByUrl('/gestion-riesgo/laboratorio');
        this._swal.show({
          icon: 'success',
          title: 'Creado con éxito',
          showCancel: false,
          text: '',
          timer: 1000,
        });
      });
    } else {
      this.faltanDatos = true;
    }
  }

  addCup(cup, $event, input) {
    this.loadingCups = true;
    this._laboratory.getCup(cup.value).subscribe((res: any) => {
      this.faltanDatos = false;
      this.loadingCups = false;
      this.cups.push(res.data);
      //console.log(this.cups)
    });
    $event.preventDefault();
    input.value = '';
  }
}
function ViewChield(PopoverComponent: any, arg1: { static: boolean }) {
  throw new Error('Function not implemented.');
}

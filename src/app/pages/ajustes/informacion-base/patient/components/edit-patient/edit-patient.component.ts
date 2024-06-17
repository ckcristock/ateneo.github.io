import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

import {
  DepartmentMunicipalityComponent,
  MunDep,
} from '@shared/components/department-municipality/department-municipality.component';

import { PatientService } from '../../patient.service';
import { SwalService } from '../../../services/swal.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    DepartmentMunicipalityComponent,
    ModalComponent,
    AutocompleteFcComponent,
    NotDataComponent,
  ],
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss',
})
export class EditPatientComponent implements OnInit {
  @Input() data = null;

  formEdit!: FormGroup;

  documents = [];

  eps = [];

  levels = [];

  regimen = [];

  valuesDepMun = {
    department_id: '',
    municipality_id: '',
  };

  loading = true;

  loadMunDep = false;

  loadingMun = false;

  constructor(
    private readonly patientService: PatientService,
    private readonly formBuilder: FormBuilder,
    private readonly swalService: SwalService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.setFormEdit();
    this.getAllRequest();
  }

  private formInit(): void {
    this.formEdit = this.formBuilder.group({
      type_document_id: ['', [Validators.required]],
      identifier: ['', [Validators.required]],
      department_id: ['', [Validators.required]],
      municipality_id: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      middlename: [''],
      surname: ['', [Validators.required]],
      secondsurname: [''],
      date_of_birth: ['', [Validators.required]],
      gener: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      eps_id: ['', [Validators.required]],
      level_id: ['', [Validators.required]],
      regimen_id: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  private setFormEdit(): void {
    if (this.data) {
      this.formEdit.patchValue({
        type_document_id: this.data['type_document_id'],
        identifier: this.data['identifier'],
        department_id: this.data['department'].id,
        municipality_id: this.data['municipality'].id,
        firstname: this.data['firstname'],
        middlename: this.data['middlename'],
        surname: this.data['surname'],
        secondsurname: this.data['secondsurname'],
        date_of_birth: this.data['date_of_birth'],
        gener: this.data['gener'],
        phone: this.data['phone'],
        email: this.data['email'],
        address: this.data['address'],
        eps_id: this.data['eps'].id,
        level_id: this.data['level'].id,
        regimen_id: this.data['regimentype'].id,
        status: this.data['state'],
      });
      const { department_id, municipality_id } = this.formEdit.value;
      this.valuesDepMun = {
        department_id,
        municipality_id,
      };
    }
  }

  private getAllRequest(): void {
    forkJoin([
      this.patientService.getDocumentType(),
      this.patientService.getEps(),
      this.patientService.getLevels(),
      this.patientService.getRegimenType(),
    ]).subscribe({
      next: ([documentType, eps, levels, regimentType]) => {
        this.documents = documentType.data;
        this.eps = eps.data;
        this.levels = levels.data;
        this.regimen = regimentType.data;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  changeMundep(values: MunDep): void {
    this.formEdit.patchValue(values);
  }

  async onEditData(): Promise<void> {
    try {
      await this.swalService.confirm('Se editarán los datos del paciente', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.patientService.putEditPatient(this.formEdit.value, this.data.id).subscribe({
              next: () => {
                this.modalService.dismissAll('request-edited');
                this.swalService.show({
                  icon: 'success',
                  title: 'Guardado correctamente',
                  text: 'El paciente ha sido actualizado',
                  showCancel: false,
                  timer: 1000,
                });
                resolve(true);
              },
              error: () => {
                resolve(false);
                this.swalService.hardError();
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
}

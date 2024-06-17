import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FILE_TYPES } from '@shared/functions/load-file';
import { PatientService } from '../../patient.service';
import { SwalService } from '../../../services/swal.service';

import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import {
  DepartmentMunicipalityComponent,
  MunDep,
} from '@shared/components/department-municipality/department-municipality.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-import-patient',
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
  templateUrl: './import-patient.component.html',
  styleUrl: './import-patient.component.scss',
})
export class ImportPatientComponent implements OnInit {
  typeFile = [FILE_TYPES.csv, FILE_TYPES.excel];

  formImport!: FormGroup;

  eps = [];

  regimen = [];

  documents = [];

  levels = [];

  loadFile = false;

  loadMunDep = false;

  loading = true;

  idDocumentType = null;

  idLevel = null;

  urlDownloadTemplate = `${environment.base_url}/download-template-imports-patients`;

  constructor(
    private readonly patientService: PatientService,
    private readonly swalService: SwalService,
    private readonly formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.getAllRequest();
  }

  private formInit(): void {
    this.formImport = this.formBuilder.group({
      department_id: ['', [Validators.required]],
      municipality_id: ['', [Validators.required]],
      eps_id: ['', [Validators.required]],
      regimen_id: ['', [Validators.required]],
      file: ['', [Validators.required]],
      state: ['Activo'],
    });
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

  onFileChanged(event: any): void {
    const file = event.target.files[0];
    this.formImport.get('file')!.setValue(file);
    this.loadFile = true;
  }

  changeMundep(values: MunDep): void {
    this.formImport.patchValue(values);
  }

  async importFile(): Promise<void> {
    const body = new FormData();
    Object.keys(this.formImport.value).forEach((key) => {
      body.append(key, this.formImport.value[key]);
    });
    try {
      await this.swalService.confirm('Se guardarán los pacientes importados', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.patientService.postImportPatient(body).subscribe({
              next: (res) => {
                this.modalService.dismissAll('request-import');
                this.swalService.show({
                  icon: 'success',
                  title: res.data.title,
                  html: `<p>${res.data.message}</p>
                  ${
                    res.data.duplicateIdentifiers
                      ? `<p>Numeros de identificacion repetidos: ${[
                          ...res.data.duplicateIdentifiers,
                        ]}</p>`
                      : ''
                  }
                  `,
                  showCancel: false,
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

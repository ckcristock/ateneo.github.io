import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { LoadFile } from '@shared/functions/load-file';
import { GlobalService } from '@shared/services/global.service';
import { MultiFilesComponent } from '@shared/components/multi-files/multi-files.component';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { LONG_TEXT } from 'src/app/core/utils/consts';
import { AddInvolveddisciplinaryComponent } from '../add-involved-disciplinary/add-involved-disciplinary.component';
import { DisciplinariosService } from '../../disciplinarios.service';
import { CabeceraComponent } from 'src/app/components/cabecera/cabecera.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-crear-proceso',
  standalone: true,
  imports: [
    MultiFilesComponent,
    CabeceraComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AutocompleteFcComponent,
    CommonModule,
    NotDataComponent,
    TextFieldModule,
  ],
  templateUrl: './crear-proceso.component.html',
  styleUrls: ['./crear-proceso.component.scss'],
})
export class CrearProcesoComponent implements OnInit {
  people$ = new Observable();

  createForm!: FormGroup;

  processs: any[] = [];

  collapsed: boolean[] = [];

  headerData: any = {
    Titulo: 'Nuevo proceso disciplinario',
    Fecha: new Date(),
  };

  loading = false;

  nameUser = '';

  constructor(
    private fb: FormBuilder,
    private _reactiveValid: ValidatorsService,
    private disciplinarioService: DisciplinariosService,
    private _swal: SwalService,
    private modalService: NgbModal,
    private router: Router,
    private readonly globalService: GlobalService,
    private readonly consecutivoService: ConsecutivosService,
  ) {}

  ngOnInit(): void {
    this.people$ = this.globalService.getPeople$;
    this.setForm();
    this.getConsecutive();
  }

  private setForm() {
    this.createForm = this.fb.group({
      person: [''],
      title: ['', [Validators.required]],
      person_id: ['', this._reactiveValid.required],
      date_of_admission: ['', [Validators.required]],
      process_description: ['', [this._reactiveValid.required, Validators.maxLength(LONG_TEXT)]],
      type: [''],
      file: [''],
      involved: this.fb.array([]),
    });
  }

  private getConsecutive(): void {
    this.disciplinarioService.getConsecutive().subscribe({
      next: (res) => {
        const data = res['data'];
        this.headerData.Codigo = this.consecutivoService.construirConsecutivo(data, '', 'PRO');
        this.headerData.CodigoFormato = data.format_code;
      },
    });
  }

  openAddInvolvedDisciplinary(): void {
    const modalRef = this.modalService.open(AddInvolveddisciplinaryComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.formArray = this.involvedList;
  }

  openMultiFiles(files: LoadFile[]): void {
    this.createForm.get('file').setValue(files);
  }

  getProcess() {
    this.disciplinarioService.getProcessByPerson(this.createForm.value.person).subscribe({
      next: (res) => {
        this.processs = res['data'];
      },
    });
  }

  get involvedList(): FormArray {
    return this.createForm.get('involved') as FormArray;
  }

  deletedInvolved(i: number): void {
    this.involvedList.removeAt(i);
  }

  memorandumsGroup(event) {
    let group = this.fb.group({
      value: event.target.value,
      id: event.target.id,
      name: event.target.name,
      date: event.target.date,
    });
    return group;
  }

  save() {
    if (this.createForm.valid /* && this.involvedList.length > 0 */) {
      this.savedisciplinary();
    } else {
      this._swal.show({
        icon: 'error',
        title: 'Faltan datos',
        showCancel: false,
        text: 'Asegúrate de agregar todos los datos',
      });
    }
  }

  async savedisciplinary(): Promise<void> {
    try {
      await this._swal.confirm(`Crear proceso disciplinario para ${this.nameUser}`, {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.disciplinarioService.createNewProcess(this.createForm.value).subscribe({
              next: () => {
                this._swal.show({
                  icon: 'success',
                  title: 'Proceso agregado con éxito',
                  showCancel: false,
                  text: '',
                  timer: 1000,
                });
                this.router.navigate(['/rrhh/procesos/disciplinarios']);
                this.createForm.reset();
                resolve(true);
              },
              error: () => {
                resolve(false);
              },
            });
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this._swal.hardError();
    }
  }
}

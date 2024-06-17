import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { GlobalService } from '@shared/services/global.service';
import { MultiFilesComponent } from '@shared/components/multi-files/multi-files.component';
import { LoadFile } from '@shared/functions/load-file';
import { LONG_TEXT } from 'src/app/core/utils/consts';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { MemorandosService } from '../../memorandos.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-create-memorandum',
  standalone: true,
  imports: [
    MultiFilesComponent,
    ModalComponent,
    ReactiveFormsModule,
    AutocompleteFcComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    AsyncPipe,
  ],
  templateUrl: './create-memorandum.component.html',
  styleUrls: ['./create-memorandum.component.scss'],
})
export class CreateMemorandumComponent implements OnInit {
  people$ = new Observable();

  formMemorando: FormGroup;

  typesLimitated = [];

  loadFile = false;

  nameUser = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly reactiveValid: ValidatorsService,
    private readonly globalService: GlobalService,
    private memorandosService: MemorandosService,
    private modalService: NgbModal,
    private swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.people$ = this.globalService.getPeople$;
    this.createFormMemorando();
    this.getList();
  }

  openMultiFiles(files: LoadFile[]): void {
    this.formMemorando.get('file').setValue(files);
  }

  private getList() {
    this.memorandosService.getMemorandumLimitated().subscribe({
      next: (res: any) => {
        this.typesLimitated = res.data;
      },
    });
  }

  private createFormMemorando() {
    this.formMemorando = this.fb.group({
      person_id: ['', this.reactiveValid.required],
      memorandum_type_id: ['', this.reactiveValid.required],
      details: ['', [this.reactiveValid.required, Validators.maxLength(LONG_TEXT)]],
      file: [''],
      level: ['Seleccione', this.reactiveValid.required],
    });
  }

  async saveMemorandum(): Promise<void> {
    try {
      await this.swal.confirm(`Crear memorando para ${this.nameUser}`, {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.memorandosService.createNewMemorandum(this.formMemorando.value).subscribe({
              next: () => {
                this.modalService.dismissAll('request-memorandum');
                this.formMemorando.reset();
                this.swal.show({
                  icon: 'success',
                  title: 'Creado con éxito',
                  showCancel: false,
                  text: '',
                  timer: 1000,
                });
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
      this.swal.hardError();
    }
  }
}

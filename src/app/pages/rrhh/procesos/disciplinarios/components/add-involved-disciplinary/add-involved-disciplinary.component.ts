import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { loadFile } from '@shared/functions/load-file';
import { GlobalService } from '@shared/services/global.service';
import { LONG_TEXT } from 'src/app/core/utils/consts';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { DisciplinariosService } from '../../disciplinarios.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-add-involved-disciplinary',
  standalone: true,
  imports: [
    ModalComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    TextFieldModule,
    ReactiveFormsModule,
    AutocompleteFcComponent,
    AsyncPipe,
    NotDataComponent,
    DatePipe,
  ],
  templateUrl: './add-involved-disciplinary.component.html',
  styleUrl: './add-involved-disciplinary.component.scss',
})
export class AddInvolveddisciplinaryComponent implements OnInit {
  @Input() formArray = new FormArray([]);

  people$ = new Observable();

  formInvolved!: FormGroup;

  historyInfo: any[] = [];

  loadFile = false;

  loading = false;

  seleccionadas: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly swal: SwalService,
    private readonly modalService: NgbModal,
    private readonly globalService: GlobalService,
    private readonly disciplinarioService: DisciplinariosService,
  ) {}

  ngOnInit(): void {
    this.people$ = this.globalService.getPeople$;
    this.createFormInvolved();
  }

  createFormInvolved(): void {
    this.formInvolved = this.fb.group({
      person_id: ['', [Validators.required]],
      person: [''],
      file: [''],
      filename: [''],
      type: [''],
      observation: ['', [Validators.maxLength(LONG_TEXT)]],
    });
  }

  getHistory(): void {
    this.historyInfo = [];
    this.loading = true;
    this.disciplinarioService.getHistory(this.formInvolved.value.person_id).subscribe({
      next: (res) => {
        this.historyInfo = res['data'];
        this.loading = false;
      },
    });
  }

  onFileChanged(event): void {
    const file = event.target.files[0];
    loadFile(file)
      .then((res) => {
        this.formInvolved.patchValue({ filename: res.name, ...res });
        this.loadFile = true;
      })
      .catch((error: string) => {
        this.swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: error,
        });
      });
  }

  onSelectOption(event): void {
    const { value, id, name, date, checked } = event.target;
    const seleccionada = {
      value,
      id,
      name,
      date,
    };
    if (checked) {
      // Add the new value in the selected options
      this.seleccionadas.push(seleccionada);
    } else {
      // removes the unselected option
      this.seleccionadas = this.seleccionadas.filter((selected) => selected.id !== id);
    }
  }

  validateInvolved(name: string): void {
    const id = this.formInvolved.get('person_id').value;
    const valid = this.formArray.value.length
      ? (this.formArray.value as []).some((person) => person['id'] !== id)
      : true;
    if (valid) {
      this.formInvolved.get('person').setValue(name);
      this.getHistory();
    } else
      this.swal.show({
        icon: 'warning',
        title: '¡Ooops!',
        text: 'El funcionario que intentas ingresar ya se encuentra involucrado en el proceso',
        showCancel: false,
      });
  }

  newInvolved() {
    this.formInvolved.addControl('memorandums', this.fb.array(this.seleccionadas));
    this.formArray.push(this.formInvolved);
    this.modalService.dismissAll();
  }
}

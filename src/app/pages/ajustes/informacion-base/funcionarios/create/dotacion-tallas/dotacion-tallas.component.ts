import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { consts } from 'src/app/core/utils/consts';
import { PersonService } from '../../../services/person.service';
import { PersonDataService } from '../personData.service';
import { SwalService } from '../../../services/swal.service';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dotacion-tallas',
  templateUrl: './dotacion-tallas.component.html',
  styleUrls: ['./dotacion-tallas.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
})
export class DotacionTallasComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();
  @Output('anterior') anterior = new EventEmitter();
  saving = false;

  shirtSize = consts.shirtSize;
  pantSizes = consts.pantSizes;
  shueSizes = consts.shueSizes;
  formDotation: UntypedFormGroup;

  person: any;
  $person: Subscription;

  constructor(
    private _personData: PersonDataService,
    private _person: PersonService,
    private fb: UntypedFormBuilder,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.shirtSize.unshift({ text: 'Seleccione', value: '' });
    this.pantSizes.unshift({ text: 'Seleccione', value: '' });
    this.shueSizes.unshift({ text: 'Seleccione', value: '' });

    this.$person = this._personData.person.subscribe((r) => {
      this.person = r;
    });
  }

  createForm() {
    this.formDotation = this.fb.group({
      shirt_size: ['', Validators.required],
      pants_size: ['', Validators.required],
      shue_size: ['', Validators.required],
    });
  }

  get shirt_size_invalid() {
    return (
      this.formDotation.get('shirt_size').invalid && this.formDotation.get('shirt_size').touched
    );
  }
  get pants_size_invalid() {
    return (
      this.formDotation.get('pants_size').invalid && this.formDotation.get('pants_size').touched
    );
  }
  get shue_size_invalid() {
    return this.formDotation.get('shue_size').invalid && this.formDotation.get('shue_size').touched;
  }

  save() {
    this.person = { ...this.person, ...this.formDotation.value };
    console.log(this.person);
    if (this.formDotation.invalid) {
      this.formDotation.markAllAsTouched();
      this._swal.incompleteError();
      return false;
    }

    const request = () => {
      this.saving = true;
      this._person.savePerson({ person: this.person }).subscribe({
        next: (r: any) => {
          if (r.status) {
            this.person.id = r.data.id;
            this._personData.person.next(this.person);
            this.siguiente.emit({});
            this.saving = false;
            const text = r.data.faceCreated
              ? 'Funcionario creado correctamente'
              : 'Funcionario creado correctamente, pero la cara no ha sido registrada';
            this._swal.success(text, 0);
          } else {
            this.saving = false;
            this._swal.error('Error', r.err);
          }
        },
        error: (err) => {
          let errorMessage = '';
          for (const field in err.error.errors) {
            errorMessage += err.error.errors[field].join('/n') + '\n';
          }
          this._swal.error('Error', errorMessage);
          this.saving = false;
        },
      });
    };
    this._swal.swalLoading('Vamos a crear un nuevo funcionario', request);
  }

  previus() {
    this.anterior.emit();
  }
  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }
}

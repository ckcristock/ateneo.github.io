import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { errorMessage, successMessage } from 'src/app/core/utils/confirmMessage';
import { Speciality } from '../speciality.model';
import { SpecialityService } from '../speciality.service';
import { ShowErrorsComponent } from '../../../../../components/show-errors/show-errors.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-speciality-modal',
  templateUrl: './speciality-modal.component.html',
  styleUrls: ['./speciality-modal.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ShowErrorsComponent,
  ],
})
export class SpecialityModalComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @Output()
  dataChange: EventEmitter<string> = new EventEmitter<string>();
  speciality: Speciality;
  form = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    code: new UntypedFormControl('', [Validators.required]),
  });

  constructor(
    private _specialityService: SpecialityService,
    private _modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.speciality = new Speciality();
  }

  openModal = async () => {
    this.form.reset();
    if (!this.speciality.id) {
      this.speciality = new Speciality();
      this._modal.open(this.modal);
    } else {
      await this._specialityService
        .getSpeciality(this.speciality.id)
        .toPromise()
        .then((req: any) => {
          this._modal.open(this.modal);
          this.speciality = Object.assign({}, req.data);
          this.form.patchValue({ id: this.speciality.id });
        });
    }
  };

  close() {
    this._modal.close();
    this.form.reset();
  }

  createNewSpeciality() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return false;
    }
    this._specialityService.createNewSpeciality(this.speciality).subscribe((res: any) => {
      res.code === 200
        ? [successMessage(), this.close(), this.dataChange.next('')]
        : errorMessage();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { ValidatorsService } from '../../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { TiposTerminosService } from './tipos-terminos.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';

@Component({
  selector: 'app-tipos-termino',
  templateUrl: './tipos-termino.component.html',
  styleUrls: ['./tipos-termino.component.scss'],
  standalone: true,
  imports: [
    NotDataSaComponent,
    CardComponent,
    TableComponent,
    AutomaticSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class TiposTerminoComponent implements OnInit {
  loading: boolean = false;
  selected: any;
  terms: any[] = [];
  form: UntypedFormGroup;
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  filtro: any = {
    name: '',
  };
  term: any = {};

  constructor(
    private _typesTermsService: TiposTerminosService,
    private fb: UntypedFormBuilder,
    private _reactiveValid: ValidatorsService,
    private _swal: SwalService,
    private _modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.getTermsTypes();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.term.id],
      name: ['', this._reactiveValid.required],
    });
  }

  getTermsTypes() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._typesTermsService.getTermsTypes(params).subscribe((res: any) => {
      this.loading = false;
      this.terms = res.data.data;
      this.pagination.length = res.data.total;
    });
  }

  close() {
    this._modal.close();
  }

  createSalaryType() {
    this._typesTermsService.createTermType(this.form.value).subscribe(
      (res: any) => {
        this.getTermsTypes();
        this._modal.close();
        this._swal.show({
          title: res.data.name,
          icon: 'success',
          text: 'Término creado exitosamente',
          timer: 1000,
          showCancel: false,
        });
      },
      (err) => {
        this._swal.show({
          title: 'ERROR',
          text: 'Intenta nuevamente',
          icon: 'error',
          showCancel: false,
        });
      },
    );
  }
}

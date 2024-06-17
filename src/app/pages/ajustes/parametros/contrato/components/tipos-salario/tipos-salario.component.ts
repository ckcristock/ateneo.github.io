import { Component, OnInit } from '@angular/core';
import { TiposSalarioService } from './tipos-salario.service';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ValidatorsService } from '../../../../informacion-base/services/reactive-validation/validators.service';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '../../../../../../shared/components/automatic-search/automatic-search.component';
import { TableComponent } from '../../../../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';

@Component({
  selector: 'app-tipos-salario',
  templateUrl: './tipos-salario.component.html',
  styleUrls: ['./tipos-salario.component.scss'],
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
export class TiposSalarioComponent implements OnInit {
  loading: boolean = false;
  selected: any;
  lists: any;
  salaries: any[] = [];
  form: UntypedFormGroup;
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtro: any = {
    name: '',
  };
  salary: any = {};
  constructor(
    private _typesSalaryService: TiposSalarioService,
    private fb: UntypedFormBuilder,
    private _reactiveValid: ValidatorsService,
    private _modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.getSalaryTypes();
    this.createForm();
  }

  close() {
    this._modal.close();
    this.form.reset();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.salary.id],
      name: ['', this._reactiveValid.required],
    });
  }

  getSalaryTypes() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._typesSalaryService.getSalaryTypes(params).subscribe((res: any) => {
      this.loading = false;
      this.salaries = res.data.data;
      this.pagination.length = res.data.total;
    });
  }

  createSalaryType() {
    this._typesSalaryService.createSalaryType(this.form.value).subscribe((res: any) => {
      this.getSalaryTypes();
      this._modal.close();
      Swal.fire({
        icon: 'success',
        title: res.data,
        text: 'Se ha agregado a los Salarios con éxito',
      });
    });
  }
}

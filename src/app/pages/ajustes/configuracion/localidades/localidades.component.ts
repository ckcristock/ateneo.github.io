import { Component, OnInit } from '@angular/core';
import { SwalService } from '../../../../pages/ajustes/informacion-base/services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { consts } from 'src/app/core/utils/consts';
import { PaisesService } from '../../informacion-base/services/paises.service';
import { DepartamentosService } from './services/departamentos.service';
import { MunicipiosService } from './services/municipios.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, UpperCasePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    NotDataComponent,
    UpperCasePipe,
    TitleCasePipe,
  ],
})
export class LocalidadesComponent implements OnInit {
  countries: any[] = [];
  states: any[] = [];
  form!: UntypedFormGroup;
  masks = consts;
  municipalities: any[] = [];
  filtro_pais: any = {
    name: '',
  };
  filtro_depto: any = {
    name: '',
  };
  filtro_muni: any = {
    name: '',
  };
  pagination_pais: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0,
  };
  pagination_depto: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0,
  };
  pagination_muni: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0,
  };

  loadingCountry: boolean = true;
  loadingState: boolean = true;
  loadingMunicipality: boolean = true;
  tipo = '';
  operation = '';
  municipalitySelected: any = 0;
  countrySelected: any;
  departmentSelected: any;

  constructor(
    private _countries: PaisesService,
    private _state: DepartamentosService,
    private _municipality: MunicipiosService,
    private _modal: ModalService,
    private _swal: SwalService,
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.getCountries();
  }

  stop(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  openConfirm(confirm: any) {
    this._modal.open(confirm, 'md');
  }

  createModal(tipo: any) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      dian_code: ['', Validators.required],
      dane_code: ['', tipo != 'paises' ? Validators.required : Validators.nullValidator],
      abbreviation: ['', tipo == 'municipios' ? Validators.required : Validators.nullValidator],
      country_id: [''],
      department_id: [''],
    });
  }

  openModal(tipo: any, add: any) {
    this.createModal(tipo);
    this.operation = 'Agregar';
    this.tipo = tipo;
    this.openConfirm(add);
  }

  editar(tipo: any, modelo: any, add: any) {
    this.createModal(tipo);
    this.form.patchValue({
      id: modelo.id,
      name: modelo.name,
      dian_code: modelo.dian_code,
      dane_code: modelo.dane_code,
      abbreviation: modelo.abbreviation,
      country_id: modelo.country_id,
      department_id: modelo.department_id,
    });
    this.tipo = tipo;
    this.operation = 'Editar';
    this.openConfirm(add);
  }

  getCountries(page = 1) {
    this.pagination_pais.page = page;
    let params = {
      ...this.pagination_pais,
      ...this.filtro_pais,
    };
    this.loadingCountry = true;
    this._countries.getCountries(params).subscribe((r: any) => {
      this.countries = r.data.data;
      this.pagination_pais.collectionSize = r.data.total;
      if (this.countries.length > 0) {
        this.countries[0].selected = true;
        this.countrySelected = this.countries[0].id;
        this.getStates(this.countries[0].id);
      }
      this.loadingCountry = false;
    });
  }

  getStates(country_id: any, page = 1) {
    this.pagination_depto.page = page;
    let params = {
      ...this.pagination_depto,
      ...this.filtro_depto,
    };
    this.loadingState = true;
    this._state.getDepartmentById(country_id, params).subscribe((r: any) => {
      this.states = r.data.data;
      this.pagination_depto.collectionSize = r.data.total;
      if (this.states.length > 0) {
        this.states[0].selected = true;
        this.departmentSelected = this.states[0].id;
        this.getMunicipalities(this.states[0].id);
      }
      if (r.data.total == 0) {
        this.municipalities = [];
      }
      this.loadingState = false;
    });
  }

  getMunicipalities(state_id: any, page = 1) {
    this.pagination_muni.page = page;
    let params = {
      ...this.pagination_muni,
      ...this.filtro_muni,
    };
    this.loadingMunicipality = true;
    this._municipality.getAllMunicipalitiesByDepartment(state_id, params).subscribe((r: any) => {
      this.municipalities = r.data.data;
      this.pagination_muni.collectionSize = r.data.total;
      if (this.municipalities.length != 0) {
        this.municipalities[0].selected = true;
      }
      if (r.data.total == 0) {
        this.municipalities = [];
      }
    });
    this.loadingMunicipality = false;
  }

  selected(model: any, value: any) {
    model = model.map((m: any) => {
      m.selected = m.id == value ? true : false;
    });
  }

  getSwal(title: any, text: any, icon: any, showCancel: any) {
    this._swal.show(
      {
        title,
        text,
        icon,
        showCancel,
      },
      false,
    );
  }

  save() {
    if (this.form.valid) {
      if (this.tipo == 'municipios') {
        this.saveMunicipality(this.form.value);
      }
      if (this.tipo == 'departamentos') {
        this.saveState(this.form.value);
      }
      if (this.tipo == 'paises') {
        this.saveCountry(this.form.value);
      }
    } else {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'Completa los campos.',
        showCancel: false,
      });
    }
  }

  saveCountry(params: any) {
    this._countries.createCountry(params).subscribe((r: any) => {
      if (r.status == false) {
        this.getSwal('Error', r.err, 'error', false);
      } else {
        this.getSwal('Operación exitosa', r.data, 'success', false);
        this.getCountries();
        this._modal.close();
      }
    });
  }

  saveState(params: any) {
    this._state.setDepartment(params).subscribe((r: any) => {
      if (r.status == false) {
        this.getSwal('Error', r.err, 'error', false);
      } else {
        this.getSwal('Operación exitosa', r.data, 'success', false);
        this.getStates(params.country_id);
        this._modal.close();
      }
    });
  }

  saveMunicipality(params: any) {
    this._municipality.createNewMunicipality(params).subscribe((r: any) => {
      if (r.status == false) {
        this.getSwal('Error', r.err, 'error', false);
      } else {
        this.getMunicipalities(params.department_id);
        this.getSwal('Operación exitosa', r.data, 'success', false);
        this._modal.close();
      }
    });
  }
}

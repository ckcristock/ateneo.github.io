import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PersonDataService } from '../personData.service';
import { Subscription } from 'rxjs';
import { CompanyService } from '../../../services/company.service';
import { WorkContractTypesService } from '../../../services/workContractTypes.service';
import { consts } from '../../../../../../core/utils/consts';
import { FixedTurnService } from '../../../turnos/turno-fijo/turno-fijo.service';
import { ReloadButtonComponent } from '../../../../../../components/reload-button/reload-button.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FilterRolName,
  FilterRolesCompanyComponent,
} from '@shared/components/filter-roles-company/filter-roles-company.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { InputPositionDirective } from '@app/core/directives/input-position.directive';
import { MatButtonModule } from '@angular/material/button';
import { SwalService } from '../../../services/swal.service';

@Component({
  selector: 'app-informacion-empresa',
  templateUrl: './informacion-empresa.component.html',
  styleUrls: ['./informacion-empresa.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatCheckboxModule,
    ReloadButtonComponent,
    FilterRolesCompanyComponent,
    NgxCurrencyDirective,
    InputPositionDirective,
    MatButtonModule,
  ],
})
export class InformacionEmpresaComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();
  @Output('anterior') anterior = new EventEmitter();
  companies: any[];
  workContractTypes: any[] = [];
  contractTerms: any[] = [];
  fixedTurns: any[];
  reload: boolean;

  $person: Subscription;
  formCompany: UntypedFormGroup;

  formRefRoles: UntypedFormGroup;

  turnos = consts.turnTypes;

  maskCOP = consts.maskCOP;

  constructor(
    private _person: PersonDataService,
    private fb: UntypedFormBuilder,
    private _company: CompanyService,
    private _workContractTypes: WorkContractTypesService,
    private _fixedTurns: FixedTurnService,
    private _swal: SwalService
  ) {}

  person: any;
  ngOnInit(): void {
    this.crearForm();
    this.reloadData();
  }

  onSelectRol(rol: FilterRolName): void {
    const rolCompany = { ...rol, position_id: rol.position };
    this.formCompany.patchValue(rolCompany);
  }

  async reloadData() {
    this.getCompanies();
    this.reload = true;
    this.getworkContractTypes();
    this.getRotatingTurns();
    this.$person = this._person.person.subscribe((r) => {
      this.person = r;
    });
    this.reload = false;
  }

  getCompanies() {
    this._company.getTypeOneCompanies().subscribe((d: any) => {
      this.companies = d.data;
      d.data[0] ? this.formCompany.patchValue({ company_id: d.data[0].value }) : '';
    });
  }

  getworkContractTypes() {
    this._workContractTypes.getWorkContractTypes().subscribe((r: any) => {
      this.workContractTypes = r.data;
    });
  }

  getContractTerms(value) {
    this._workContractTypes.getContractTerms().subscribe((r: any) => {
      this.contractTerms = [];
      r.data.forEach((contract_term: any) =>
        contract_term.work_contract_types.forEach((work_contract_type: any) => {
          if (work_contract_type.id == value) {
            this.contractTerms.push(contract_term);
          }
        }),
      );
    });
  }

  getRotatingTurns() {
    this._fixedTurns.comboFixedTurns().subscribe((r: any) => {
      this.fixedTurns = r.data;
    });
  }
  crearForm() {
    this.formCompany = this.fb.group({
      company_id: ['', Validators.required],
      group_id: ['', Validators.required],
      dependency_id: ['', Validators.required],
      position_id: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_admission: [new Date().toISOString().substring(0, 10), Validators.required],
      work_contract_type_id: ['', Validators.required],
      contract_term_id: ['', Validators.required],
      turn_type: ['fijo', Validators.required],
      fixed_turn_id: ['', Validators.required],
      date_end: ['', Validators.required],
      transport_assistance: [''],
    });
    this.formCompany.get('date_end').disable();
    this.setFormRefRoles();
  }

  private setFormRefRoles(): void {
    const getControl = (key: string) => this.formCompany.get(key);
    this.formRefRoles = this.fb.group({});
    this.formRefRoles.addControl('dependency_id', getControl('dependency_id'));
    this.formRefRoles.addControl('position', getControl('position_id'));
    this.formRefRoles.addControl('group_id', getControl('group_id'));
  }

  turnChanged(turno) {
    if (turno === 'Fijo' || turno === 'fijo') {
      this.formCompany.get('fixed_turn_id').enable();
      this.formCompany.get('fixed_turn_id').setValidators(Validators.required);
    } else {
      this.formCompany.get('fixed_turn_id').disable();
      this.formCompany.get('fixed_turn_id').clearValidators();
    }
  }
  conludeContract = false;
  workContractTypesChanged(conclude) {
    if (conclude) {
      this.formCompany.get('date_end').enable();
      this.conludeContract = true;
    } else {
      this.formCompany.get('date_end').disable();
      this.conludeContract = false;
    }
  }
  save() {
    const { position, ...values } = this.formRefRoles.value;
    this.formCompany.patchValue({ position_id: position, values });
    if (this.formCompany.invalid) {
      this.formCompany.markAllAsTouched();
      this._swal.incompleteError();
      return false;
    }
    this.person.workContract = { ...this.formCompany.value };
    this._person.person.next(this.person);
    this.siguiente.emit({});
  }

  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }

  previus() {
    this.anterior.emit();
  }
}

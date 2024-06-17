import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { consts } from 'src/app/core/utils/consts';
import { CompanyService } from '../../../../services/company.service';
import { SwalService } from '../../../../services/swal.service';
import { DatosEmpresaService } from './datos-empresa.service';
import { FixedTurnService } from '../../../../turnos/turno-fijo/turno-fijo.service';
import { UserDetail } from '../../interfaces/detalle.interface';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { UpperCasePipe } from '@angular/common';
import { AutocompleteFcComponent } from '@app/components/autocomplete-fc/autocomplete-fc.component';
import {
  FilterRolName,
  FilterRolesCompanyComponent,
} from '@shared/components/filter-roles-company/filter-roles-company.component';

@Component({
  selector: 'app-datos-empresa',
  templateUrl: './datos-empresa.component.html',
  styleUrls: ['./datos-empresa.component.scss'],
  standalone: true,
  imports: [
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    UpperCasePipe,
    AutocompleteFcComponent,
    FilterRolesCompanyComponent,
  ],
})
export class DatosEmpresaComponent implements OnInit {
  @Input() userDetail: Partial<UserDetail> = {};

  @Output() updateSuccess: EventEmitter<void> = new EventEmitter();

  @ViewChild('add') add: any;
  form: UntypedFormGroup;
  id: any;
  turnos = consts.turnTypes;
  fixed_turns: any[];
  loading: boolean;
  companies: any[];
  loadingInfo: boolean = false;
  empresa: any;

  formRefRoles: UntypedFormGroup;
  turnSelected = '';

  constructor(
    private fb: UntypedFormBuilder,
    private enterpriseDataService: DatosEmpresaService,
    private activatedRoute: ActivatedRoute,
    private _company: CompanyService,
    private _modal: ModalService,
    private _swal: SwalService,
    private _fixedTurns: FixedTurnService,
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.createForm();
    this.setDataUserToForm();
  }

  private setDataUserToForm(): void {
    const contractUltimate = this.userDetail?.contractultimate_full_information;
    this.form.patchValue({
      fixed_turn_id: contractUltimate?.fixed_turn_id,
      position_id: contractUltimate?.position?.id,
      group_id: contractUltimate?.position?.dependency?.group_id,
      dependency_id: contractUltimate?.position?.dependency_id,
      company_id: contractUltimate?.company?.id,
      id: contractUltimate?.id,
      turn_type: contractUltimate?.turn_type,
    });
    this.loading = false;
    this.setFormRefRoles();
  }

  async openModal() {
    this._modal.open(this.add, 'lg');
    this.loadingInfo = true;
    this.getCompanies();
    this.getFixed_turn();
    this.loadingInfo = false;
  }

  getFixed_turn() {
    this._fixedTurns.getFixedTurnsActive().subscribe((r: any) => {
      this.fixed_turns = r.data;
    });
  }

  getCompanies() {
    this._company.getTypeOneCompanies().subscribe((d: any) => {
      this.companies = d.data;
    });
  }

  turnChanged(turno) {
    if (turno == 'Fijo') {
      this.form.get('fixed_turn_id').enable();
      this.form.get('fixed_turn_id').setValidators(Validators.required);
    } else {
      this.form.get('fixed_turn_id').clearValidators();
      this.form.patchValue({ fixed_turn_id: null });
    }
  }

  onSelectRol(rol: FilterRolName): void {
    const rolCompany = { ...rol, position_id: rol.position };
    this.form.patchValue(rolCompany);
  }

  updateEnterpriseData() {
    const request = () => {
      const { position, ...values } = this.formRefRoles.value;
      this.form.patchValue({ position_id: position, values });
      this.form.markAllAsTouched();
      if (this.form.invalid) {
        return false;
      }
      this.enterpriseDataService.updateEnterpriseData(this.form.value).subscribe((res) => {
        this.updateSuccess.emit();
        this._modal.close();
        this._swal.show({
          title: 'Actualizado correctamente',
          text: '',
          icon: 'success',
          showCancel: false,
          timer: 1000,
        });
      });
    };
    this._swal.swalLoading('', request);
  }

  createForm() {
    this.form = this.fb.group({
      dependency_id: ['', Validators.required],
      position_id: ['', Validators.required],
      fixed_turn_id: [''],
      group_id: ['', Validators.required],
      turn_type: ['', Validators.required],
      company_id: ['', Validators.required],
      id: [''],
    });

    this.form.get('turn_type').valueChanges.subscribe({
      next: (res) => {
        this.turnSelected = res;
        const fixedTurn = this.form.get('fixed_turn_id');
        if (this.turnSelected === 'fijo') {
          setTimeout(() => {
            fixedTurn.setValidators([Validators.required]);
            fixedTurn.updateValueAndValidity();
          });
        }
      },
    });
  }

  private setFormRefRoles(): void {
    const getControl = (key: string) => this.form.get(key);
    this.formRefRoles = this.fb.group({});
    this.formRefRoles.addControl('dependency_id', getControl('dependency_id'));
    this.formRefRoles.addControl('position', getControl('position_id'));
    this.formRefRoles.addControl('group_id', getControl('group_id'));
  }

  get dependency_valid() {
    return this.form.get('dependency_id').invalid && this.form.get('dependency_id').touched;
  }

  get fixed_turn_valid() {
    return this.form.get('fixed_turn_id').invalid && this.form.get('fixed_turn_id').touched;
  }

  get position_valid() {
    return this.form.get('position_id').invalid && this.form.get('position_id').touched;
  }

  get turn_valid() {
    return this.form.get('turn_type').invalid && this.form.get('turn_type').touched;
  }
}

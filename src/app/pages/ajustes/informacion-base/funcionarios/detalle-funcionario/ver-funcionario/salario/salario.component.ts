import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SalarioService } from './salario.service';
import { consts } from 'src/app/core/utils/consts';
import { DatosBasicosService } from '../datos-basicos/datos-basicos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../../services/swal.service';
import { WorkContractTypesService } from '../../../../services/workContractTypes.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { WorkContractService } from '../../../../services/work-contract.service';
import { UserDetail } from '../../interfaces/detalle.interface';
import { addDays } from '@fullcalendar/core/internal';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputPositionDirective } from '../../../../../../../core/directives/input-position.directive';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { BonoComponent } from '../bono/bono.component';
import { UpperCasePipe, DecimalPipe, DatePipe } from '@angular/common';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CompanyService } from '@app/pages/ajustes/informacion-base/services/company.service';
import {
  FilterRolName,
  FilterRolesCompanyComponent,
} from '@shared/components/filter-roles-company/filter-roles-company.component';

@Component({
  selector: 'app-salario',
  templateUrl: './salario.component.html',
  styleUrls: ['./salario.component.scss'],
  standalone: true,
  imports: [
    BonoComponent,
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    InputPositionDirective,
    MatCheckboxModule,
    MatDatepickerModule,
    NgxCurrencyDirective,
    UpperCasePipe,
    DecimalPipe,
    DatePipe,
    FilterRolesCompanyComponent,
  ],
})
export class SalarioComponent implements OnInit {
  @Input() userDetail: Partial<UserDetail> = {};
  @Output() updateSuccess: EventEmitter<void> = new EventEmitter();

  @ViewChild('modal') modal: any;
  form: UntypedFormGroup;
  formHistoryContract: UntypedFormGroup;
  contract_types: any;
  salary_history: any[] = [];
  contractTerms: any[] = [];
  workContractsTypesList: any[] = [];
  loading: boolean;
  contracts: any[] = [];
  companies: any[];
  loadingInfo: boolean = false;
  mask = consts;
  salary_info: any = {
    salary: '',
    contract_type: '',
    date_of_admission: '',
    date_end: '',
    contract_term_id: '',
    transport_assistance: '',
  };

  constructor(
    private fb: UntypedFormBuilder,
    private salaryService: SalarioService,
    private activateRoute: ActivatedRoute,
    private basicDataService: DatosBasicosService,
    private _workContractTypes: WorkContractTypesService,
    private modalService: NgbModal,
    private _modal: ModalService,
    private _swal: SwalService,
    private _workContract: WorkContractService,
    private _company: CompanyService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.setUserForm();
  }

  getAllUserInfo() {
    this.updateSuccess.emit();
  }

  private setUserForm(): void {
    const contractUltimate = this.userDetail.contractultimate_full_information;
    this.form.patchValue({
      id: contractUltimate.id,
      salary: contractUltimate.salary,
      work_contract_type_id: contractUltimate.work_contract_type_id,
      contract_term_id: contractUltimate.contract_term_id,
      date_of_admission: contractUltimate.date_of_admission,
      date_end: contractUltimate.date_end,
      transport_assistance: contractUltimate.transport_assistance,
    });
    if (contractUltimate.work_contract_type_id !== 2) {
      this.form.get('date_end').disable();
    }
    this.form.get('work_contract_type_id').valueChanges.subscribe((r) => {
      this.getContractTerms(r);
    });
  }

  private getCompanies() {
    this._company.getTypeOneCompanies().subscribe({
      next: (res: any) => {
        this.companies = res.data;
        this.formHistoryContract.get('company_id').setValue(this.companies[0].value);
      },
    });
  }

  private getContractTypes(): void {
    this.salaryService.getWorkContractType().subscribe((d: any) => {
      this.contract_types = d.data;
    });
  }

  //Secccion Historial de contratos
  openModalContracts(content) {
    this.createFormHistoryContract();
    this.getCompanies();
    this._modal.open(content, 'lg');
    this._workContractTypes.getWorkContractTypeList().subscribe((r: any) => {
      this.workContractsTypesList = r.data;
    });
    this.getContractTypes();
    this._workContract.getWorkContractList(this.id).subscribe((r: any) => {
      this.contracts = r.data;
    });
  }

  onSelectRol(rol: FilterRolName) {
    this.formHistoryContract.get('position_id').setValue(rol.position);
  }

  dateFilter = (date: Date) => {
    for (const contract of this.contracts) {
      let date_end_aux = new Date(contract.date_end);
      let date_end = addDays(date_end_aux, 1);
      let date_of_admission = new Date(contract.date_of_admission);
      if (contract.date_end) {
        if (date >= date_of_admission && date <= date_end) {
          return false;
        }
      } else {
        if (date >= date_of_admission) {
          return false;
        }
      }
    }
    return true;
  };

  createFormHistoryContract() {
    this.formHistoryContract = this.fb.group({
      salary: ['', Validators.required],
      work_contract_type_id: ['', Validators.required],
      contract_term_id: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      date_end: ['', Validators.required],
      position_id: ['', Validators.required],
      company_id: ['', Validators.required],
      liquidated: [1],
      person_id: [this.id],
    });
    this.formHistoryContract.get('work_contract_type_id').valueChanges.subscribe((r) => {
      this.getContractTerms(r);
    });

    this.formHistoryContract.get('date_end').valueChanges.subscribe((value) => {
      if (value) {
        let date_of_admission = this.formHistoryContract.get('date_of_admission').value;
        if (value && date_of_admission) {
          this.validateContractDates(date_of_admission, value);
        }
      }
    });
    this.formHistoryContract.get('date_of_admission').valueChanges.subscribe((value) => {
      if (value) {
        let date_end = this.formHistoryContract.get('date_end').value;
        if (value && date_end) {
          this.validateContractDates(value, date_end);
        }
      }
    });
  }

  validateContractDates(admission: Date, end: Date) {
    let start_ = new Date(admission).getTime();
    let end_ = new Date(end).getTime();
    if (start_ > end_) {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'El rango de fechas es invalido',
        showCancel: false,
      });
      this.formHistoryContract.patchValue({
        date_of_admission: null,
        date_end: null,
      });
    }
    for (const contract of this.contracts) {
      let date_end = new Date(contract.date_end).getTime();
      let date_of_admission = new Date(contract.date_of_admission).getTime();
      if (contract.date_end != null && contract.date_end != undefined && contract.date != '') {
        if (date_of_admission >= start_ && date_end <= end_) {
          this._swal.show({
            icon: 'error',
            title: 'ERROR',
            text: 'El rango de fechas es invalido',
            showCancel: false,
          });
          this.formHistoryContract.patchValue({
            date_of_admission: null,
            date_end: null,
          });
        }
      }
    }
  }

  addHistoryContract() {
    if (this.formHistoryContract.valid) {
      const request = () => {
        this._workContract
          .addContract(this.formHistoryContract.value)
          .subscribe((response: any) => {
            this._modal.close();
            this.updateSuccess.emit();
            this._swal.show({
              title: response.data,
              icon: 'success',
              text: '',
              timer: 1000,
              showCancel: false,
            });
          });
      };
      this._swal.swalLoading('Vamos a guardar el contrato', request);
    } else {
      this._swal.show({
        title: 'ERROR',
        icon: 'error',
        text: 'Porfavor llena todos los campos del formulario',
      });
    }
  }

  closeResult = '';

  public async openConfirm(confirm) {
    this.modalService
      .open(confirm, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'md',
        scrollable: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
    this.loadingInfo = true;
    this.getContractTypes();
    await this.getContractTerms(
      this.userDetail.contractultimate_full_information.work_contract_type_id,
    );
    this.loadingInfo = false;
  }
  private getDismissReason(reason: any) {}

  createForm() {
    this.form = this.fb.group({
      id: [''],
      salary: ['', Validators.required],
      work_contract_type_id: ['', Validators.required],
      contract_term_id: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      date_end: ['', Validators.required],
      transport_assistance: [''],
    });
  }

  async getContractTerms(value) {
    console.log('ey');
    await this._workContractTypes
      .getContractTerms()
      .toPromise()
      .then((r: any) => {
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

  loadingHistory: boolean;
  conludeContract = false;
  changeType(conclude) {
    if (conclude) {
      this.form.get('date_end').enable();
      this.conludeContract = true;
    } else {
      this.form.get('date_end').disable();
      this.conludeContract = false;
    }
  }

  updateSalaryInfo() {
    const request = () => {
      this.salaryService.updateSalaryInfo(this.form.value).subscribe((res) => {
        this.modalService.dismissAll();
        this.updateSuccess.emit();
        this._swal.show({
          title: 'Actualizado correctamente',
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false,
        });
        this.basicDataService.datos$.emit();
      });
    };
    this._swal.swalLoading('', request);
  }
  get work_contract_type_id_valid() {
    return (
      this.form.get('work_contract_type_id').invalid &&
      this.form.get('work_contract_type_id').touched
    );
  }

  get salary_valid() {
    return this.form.get('salary').invalid && this.form.get('salary').touched;
  }

  get date_of_admission_valid() {
    return this.form.get('date_of_admission').invalid && this.form.get('date_of_admission').touched;
  }

  get retirement_date_valid() {
    return this.form.get('date_end').invalid && this.form.get('date_end').touched;
  }

  get id(): void {
    return this.activateRoute.snapshot.params.id;
  }
}

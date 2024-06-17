import {
  FilterRolName,
  FilterRolesCompanyComponent,
} from '@shared/components/filter-roles-company/filter-roles-company.component';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { consts } from 'src/app/core/utils/consts';
import { ContratosService } from './contratos.service';
import { DependenciesService } from '@app/services/dependencies.service';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { FixedTurnService } from '../../ajustes/informacion-base/turnos/turno-fijo/turno-fijo.service';
import { InputPositionDirective } from '../../../core/directives/input-position.directive';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorIntl, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalPreliquidarComponent } from '@app/components/modal-preliquidar/modal-preliquidar.component';
import { ModalService } from 'src/app/core/services/modal.service';
import { NgIf, NgFor, UpperCasePipe, DecimalPipe, DatePipe } from '@angular/common';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { PositionService } from '@app/services/positions.service';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { TiposTerminosService } from '@app/pages/ajustes/parametros/contrato/components/tipos-termino/tipos-terminos.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss'],
  standalone: true,
  imports: [
    NotDataSaComponent,
    CardComponent,
    TableComponent,
    NgIf,
    DropdownActionsComponent,
    ActionButtonComponent,
    NgFor,
    MatBadgeModule,
    MatTooltipModule,
    LoadImageComponent,
    MatPaginatorModule,
    FilterRolesCompanyComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    NgxCurrencyDirective,
    InputPositionDirective,
    ModalPreliquidarComponent,
    UpperCasePipe,
    DecimalPipe,
    DatePipe,
  ],
})
export class ContratosComponent implements OnInit {
  formContrato: UntypedFormGroup;
  formFilters: UntypedFormGroup;
  contractData: boolean;
  contracts: any[] = [];
  loading = true;
  minRenewalPeriod = { date: '', numDays: 0 };
  listaTiposTurno: any = [];
  listaTurnos: any = [];
  contractsTrialPeriod: any = [];
  contractsToExpire: any = [];
  dependencies: any[];
  positions: any[];
  companies: any[] = [];
  terms: any[] = [];
  contractTypes: any[] = [];
  funcionario: any;
  orderObj: any;
  filtrosActivos: boolean = false;
  paginationMaterial: any;
  pagination = {
    page: 0,
    pageSize: 0,
    length: 0,
  };
  paginationMaterialExpire: any;
  paginationExpire: any = {
    page: '',
    pageSize: localStorage?.getItem('paginationPorVencer') || 5,
  };
  masksMoney = consts;
  filteredDependencies: any[] = [];
  filteredPosition: any[] = [];

  defaultParams!: FilterRolName;

  statusList = [
    { text: 'Todos', value: '' },
    { text: 'Activo', value: 'activo' },
    { text: 'Preliquidado', value: 'preliquidado' },
    { text: 'Liquidado', value: 'liquidado' },
  ];

  defaultValueContract!: FilterRolName;

  constructor(
    private contractService: ContratosService,
    private _positions: PositionService,
    private _dependencies: DependenciesService,
    private _modal: ModalService,
    private _swal: SwalService,
    private _typesTermsService: TiposTerminosService,
    private _fixedTurns: FixedTurnService,
    private paginator: MatPaginatorIntl,
    private _paginator: PaginatorService,
    private fb: UntypedFormBuilder,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.paginator.itemsPerPageLabel = 'Items por página:';
  }

  ngOnInit(): void {
    /* this.getDependencies();
    this.getPositions(); */
    this.getContractsToExpire();
    this.getContractByTrialPeriod();
    this.getTurnTypes();
    this.createFormFilters();
    this.getUrlFilters();
    this.getAllContracts();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.formFilters.patchValue(this.urlFiltersService.currentFilters);
    const {
      dependency = 0,
      group = 0,
      person = 0,
      position = 0,
    } = this.urlFiltersService.currentFilters;
    this.defaultParams = {
      dependency_id: +dependency,
      group_id: +group,
      person_id: +person,
      position: +position,
    };
  }

  createFormFilters(): void {
    this.formFilters = this.fb?.group({
      person: '',
      dependency: '',
      position: '',
      group: '',
    });
  }

  setFormFilters(filters: FilterRolName): void {
    this.formFilters.patchValue({
      person: +filters.person_id,
      dependency: +filters.dependency_id,
      position: +filters.position,
      group: +filters.group_id,
    });
    this.getAllContracts();
  }

  getTurnTypes(): void {
    this.listaTiposTurno = [
      {
        tipoTurno: 'Rotativo',
      },
      {
        tipoTurno: 'Fijo',
      },
    ];
  }

  getTurnsbyType(turnType: string): void {
    this.listaTurnos = [];
    this.formContrato.get('turn_id').setValue('');
    if (turnType == 'Fijo') {
      this._fixedTurns.getFixedTurnsActive().subscribe((res: any) => {
        res.data.forEach((data) => {
          this.listaTurnos.push({ id: data.value, name: data.text });
        });
      });
    } else {
      this.formContrato.get('turn_id').clearValidators();
      this.formContrato.patchValue({ turn_id: null });
    }
  }

  get turnSelected(): AbstractControl {
    return this.formContrato.get('turn_type').value;
  }

  calcularDias(event: Event): void {
    const target = event.target as HTMLInputElement;
    const date = new Date(target.value);
    const dateInicio = new Date(this.formContrato.get('date_of_admission').value);
    dateInicio.setDate(dateInicio.getDate() - 1);
    const numDias = Math.floor((date.getTime() - dateInicio.getTime()) / (1000 * 60 * 60 * 24));
    this.formContrato.get('date_diff').setValue(numDias);
  }

  calcularFecha(event): void {
    if (event.target.value != '') {
      const dateInicio = new Date(this.formContrato.get('date_of_admission').value);
      dateInicio.setDate(dateInicio.getDate() - 1 + parseInt(event.target.value));
      this.formContrato.get('date_end').setValue(dateInicio.toISOString().split('T')[0]);
      if (this.formContrato.controls.date_diff.hasError('min')) {
        this._swal.show({
          title: '',
          text: ' La fecha de finalización debe ser posterior a ' + this.minRenewalPeriod.date,
          icon: 'error',
          showCancel: false,
        });
        this.formContrato.get('date_diff').setValue(this.minRenewalPeriod.numDays);
        this.formContrato.get('date_end').setValue(this.minRenewalPeriod.date);
      }
    }
  }
  handlePageEvent2(event: PageEvent): void {
    this._paginator.handlePageEvent(event, this.paginationExpire);
    this.getContractsToExpire();
  }

  getAllContracts(): void {
    this.loading = true;
    const params = {
      ...this.pagination,
      ...this.formFilters.value,
    };

    this.contractService.getAllContracts(params).subscribe((res: any) => {
      this.contracts = res.data.data;
      this.paginationMaterial = res?.data;
      this.pagination.length = res?.data.total;
      if (this.paginationMaterial?.last_page < this.pagination?.page) {
        this.paginationMaterial.current_page = 1;
        this.pagination.page = 1;
        this.getAllContracts();
      }
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  getTermsTypes(value: number): void {
    this._typesTermsService.getTermsTypeList().subscribe((res: any) => {
      this.terms = [];
      res.data.forEach((contract_term: any) =>
        contract_term.work_contract_types.forEach((work_contract_type: any) => {
          if (work_contract_type.id == value) {
            this.terms.push(contract_term);
          }
        }),
      );
    });
  }
  getDependencies(): void {
    this.contractService.getDependencies().subscribe((d: any) => {
      this.dependencies = d.data;
    });
  }

  getPositions(): void {
    this.contractService.getPositions().subscribe((d: any) => {
      this.positions = d.data;
    });
  }

  getDependenciesByGroup(group_id: number): void {
    this.formContrato.get('dependency_id').setValue('');
    this._dependencies.getDependencies({ group_id }).subscribe((r: any) => {
      this.dependencies = r.data;
      this.filteredDependencies = r.data.slice();
    });
  }

  getPositionsByDependency(dependency_id: number): void {
    this.formContrato.get('position_id').setValue('');
    this._positions.getPositions({ dependency_id }).subscribe((r: any) => {
      this.positions = r.data;
      this.filteredPosition = r.data.slice();
    });
  }

  getContractsToExpire(): void {
    this.contractData = true;
    this.contractService.getContractsToExpire(this.paginationExpire).subscribe((res: any) => {
      this.contractsToExpire = res.data.data;
      this.contractsToExpire.renewed = res.data.data == 1 || null;
      this.paginationMaterialExpire = res?.data;
      if (this.paginationMaterialExpire?.last_page < this.paginationExpire?.page) {
        this.paginationMaterialExpire.current_page = 1;
        this.paginationExpire.page = 1;
        this.getContractsToExpire();
      }
      this.contractData = false;
    });
  }

  download(id: number, contract: any): void {
    const request = () => {
      this.contractService.download(id).subscribe((response: any) => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        const filename =
          contract.first_name +
          contract.first_surname +
          '-' +
          formattedDate +
          '-' +
          contract.contractultimate_full_information.work_contract_type.name;
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        let swal = {
          icon: 'success',
          title: 'Contrato',
          text: 'Contrato descargado',
          timer: 1000,
          showCancel: false,
        };
        this._swal.show(swal);
      });
    };
    this._swal.swalLoading('Descargar contrato', request);
  }

  getContractByTrialPeriod(): void {
    this.contractService.getContractByTrialPeriod().subscribe((res: any) => {
      this.contractsTrialPeriod = res.data;
    });
  }

  // Se toma la decisión de si se renueva al contraro o se liquida.
  makeChoice(employee: object, modal: TemplateRef<any>): void {
    if (employee['renewed'] == null || employee['renewed']) {
      (async (): Promise<any> => {
        const { value: choice } = await Swal.fire({
          title: employee['renewed']
            ? `El contrato de ${
                employee['first_name'] + ' ' + employee['first_surname']
              } ya presenta un proceso de renovación de contrato. Qué desea hacer?`
            : `Seleccione qué acción se tomará sobre el contrato de ${
                employee['first_name'] + ' ' + employee['first_surname']
              }.`,
          icon: 'question',
          input: 'radio',
          inputOptions: {
            true: employee['renewed'] ? 'Ajustar condiciones' : 'Renovar',
            false: 'Liquidar',
          },
          footer:
            employee['cantidad'] > 0
              ? 'Renovaciones previas: <strong>' + employee['cantidad'] + '</strong>'
              : '',
          confirmButtonColor: this._swal.buttonColor.confirm,
          inputValidator: (value) => {
            if (!value) {
              return 'Debes seleccionar una acción!';
            }
          },
        });

        if (choice) {
          if (choice == 'true') {
            // Se renueva
            this.adjustRenewal(employee, modal);
          } else {
            // Se preliquida
            this.formContrato = this.fb.group({
              codigo: [null],
              contract_id: [employee['contract_id']],
              person_id: [employee['id']],
              name: [null],
              renewed: [0],
              company_id: [null],
              company_name: [null],
              contract_term_id: [null],
              work_contract_type_id: [null],
              group_id: [null],
              dependency_id: [null],
              position_id: [null],
              turn_type: [null],
              turn_id: [null],
              date_of_admission: [null],
              date_end: [null],
              date_diff: [null],
              old_date_end: [null],
              salary: [null],
            });
            if (employee['renewed']) {
              this.formContrato.addControl('id', this.fb.control(employee['process_id']));
            }
            this.contractService
              .saveFinishContractConditions(this.formContrato.value)
              .subscribe(() => {
                Swal.fire({
                  html: `El contrato será liquidado el día ${employee['date_end']}.`,
                  confirmButtonColor: this._swal.buttonColor.confirm,
                });
                this.getContractsToExpire();
              });
          }
        }
      })();
    } else {
      Swal.fire({
        title: '¡Atención!',
        text: 'Este empleado ya presenta un proceso de preliquidación de contrato, ¿deseas renovarlo?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: this._swal.buttonColor.confirm,
        cancelButtonColor: this._swal.buttonColor.cancel,
        confirmButtonText: 'Renovar contrato',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        footer:
          employee['cantidad'] > 0
            ? 'Renovaciones previas: <strong>' + employee['cantidad'] + '</strong>'
            : '',
      }).then((result) => {
        if (result.isConfirmed) {
          this.adjustRenewal(employee, modal);
        }
      });
    }
  }

  adjustRenewal(employee, modal) {
    /**
     * Si ya existe un proceso de renovación, se trae la información previamente registrada,
     * de lo contrario, se trae la información del contrato vigente.
     */
    let service = employee.renewed
      ? this.contractService.getContractRevewal(employee.process_id)
      : this.contractService.getContract(employee.id);
    service.subscribe((res: any) => {
      res.data['contract_id'] = employee.renewed ? res.data.contract_id : res.data.id;
      res.data['codigo'] = 'CON' + res.data.contract_id;
      res.data['renewed'] = true;
      if (res.data.turn_type == 'Fijo') {
        res.data['turn_id'] = res.data.fixed_turn_id;
      } else {
        res.data['turn_id'] = res.data.rotating_turn_id;
      }
      delete res.data.rotating_turn_id;
      delete res.data.rotating_turn_name;
      delete res.data.fixed_turn_id;
      delete res.data.fixed_turn_name;
      delete res.data.group_name;
      delete res.data.dependency_name;
      delete res.data.position_name;
      delete res.data.id;

      /** Si lleva menos de tres renovaciones y si el periodo es menor a un año,
       *  se procede a renovar por al menos un año. Pero si es la cuarta renovación
       *  y si el periodo es menor a un año, se procede a renovar por al menos un año.
       *  Lo mismo sucede si el periodo desde el contrato original ha sido menor de un año.
       */
      if (res.data.date_diff >= 365 || employee.cantidad >= 3) {
        res.data.date_diff = 365;
        let dateEnd = new Date(res.data.date_of_admission);
        dateEnd.setDate(dateEnd.getDate() - 1 + res.data.date_diff);
        res.data.date_end = dateEnd.toISOString().split('T')[0];
      }
      this.minRenewalPeriod = {
        date: res.data.date_end,
        numDays: res.data.date_diff,
      };
      this.formContrato = this.fb.group({
        codigo: [''],
        contract_id: [employee.contract_id, Validators.required],
        person_id: [employee.id, Validators.required],
        name: [''],
        renewed: [1, Validators.required],
        company_id: ['', Validators.required],
        company_name: ['', Validators.required],
        contract_term_id: ['', Validators.required],
        work_contract_type_id: ['', Validators.required],
        group_id: ['', Validators.required],
        dependency_id: ['', Validators.required],
        position_id: ['', Validators.required],
        turn_type: ['', Validators.required],
        turn_id: ['', Validators.required],
        date_of_admission: ['', Validators.required],
        date_end: ['', [Validators.min(res.data.date_end), Validators.required]],
        date_diff: ['', [Validators.min(res.data.date_diff), Validators.required]],
        old_date_end: ['', Validators.required],
        salary: ['', Validators.required],
      });
      /* const formVacio = Object.fromEntries(
        Object.entries(res.data)
        .map(([ key ]) => [ key,  ['',(key=='date_diff')?[Validators.min(res.data.date_diff),Validators.required]:Validators.required] ])
      );
      this.formContrato = this.fb.group(formVacio); */

      this.formContrato.get('work_contract_type_id').valueChanges.subscribe((r) => {
        this.getTermsTypes(r);
        if (r !== 2) {
          this.formContrato.get('date_end').disable();
        } else {
          this.formContrato.get('date_end').enable();
        }
      });

      // Si se va a modificar un proceso existente, se crea de nuevo el campo "id".
      if (employee.renewed != null) {
        this.formContrato.addControl('id', this.fb.control(employee.process_id));
      }
      this.getDependenciesByGroup(res.data.group_id);
      this.getPositionsByDependency(res.data.dependency_id);
      this.getTurnsbyType(res.data.turn_type);
      this.formContrato.patchValue(res.data);
      this.defaultValueContract = {
        dependency_id: res.data.dependency_id,
        group_id: res.data.group_id,
        position: res.data.position_id,
      };
      this._modal.open(modal);
    });
  }

  setContractRolValue(roles: FilterRolName): void {
    this.formContrato.patchValue({
      dependency_id: roles.dependency_id,
      group_id: roles.group_id,
      position_id: roles.position,
    });
  }

  saveRenewalConditions() {
    if (this.formContrato.valid) {
      if (this.formContrato.get('turn_type').value == 'Fijo') {
        this.formContrato.addControl(
          'fixed_turn_id',
          this.fb.control(this.formContrato.get('turn_id').value),
        );
      } else {
        this.formContrato.addControl(
          'rotating_turn_id',
          this.fb.control(this.formContrato.get('turn_id').value),
        );
      }
      this.formContrato.removeControl('turn_id');
      this.contractService.saveFinishContractConditions(this.formContrato.value).subscribe(
        (res: any) => {
          this._modal.close();
          this._swal.show({
            icon: 'success',
            title: res.data,
            text: 'Las condiciones se han registrado con éxito.',
            timer: 1000,
            showCancel: false,
          });
          this.getContractsToExpire();
        },
        (err) => {
          this._swal.show({
            title: 'ERROR',
            text: err.error.text,
            icon: 'error',
            showCancel: false,
          });
        },
      );
    } else {
      this._swal.show({
        title: 'ERROR',
        text: 'Parte de la información suministrada no es correcta, por favor verifique e intente de nuevo.',
        icon: 'error',
        showCancel: false,
      });
    }
  }
}

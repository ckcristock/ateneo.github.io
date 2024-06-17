import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/services/person/person.service';
import { LoanService } from 'src/app/pages/nomina/prestamos-libranzas/loan.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from './nomina-config.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AutocompleteFcComponent } from '../../../components/autocomplete-fc/autocomplete-fc.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfiguracionTablaComponent } from './configuracion-tabla/configuracion-tabla.component';
import { NgIf, NgFor, LowerCasePipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

export type Updates = Partial<
  Record<'people' | 'account' | 'counterpart' | 'percent' | 'modality' | 'check', boolean>
>;

interface RowProps {
  name: string;
  updates: Updates;
  add?: boolean;
}

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ConfiguracionTablaComponent,
    ModalComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AutocompleteFcComponent,
    MatSelectModule,
    MatOptionModule,
    NotDataComponent,
    LowerCasePipe,
    CardComponent,
  ],
})
export class ConfiguracionComponent implements OnInit {
  rowName: Record<string, RowProps> = {
    responsables: {
      name: 'Responsables de aprobación de nómina',
      updates: {
        people: true,
      },
      add: true,
    },
    salarios: {
      name: 'Salario y subsidios',
      updates: {
        account: true,
        counterpart: true,
      },
    },
    extras: {
      name: 'Horas extras y recargos',
      updates: {
        account: true,
        percent: true,
      },
    },
    segSocFunc: {
      name: 'Aportes seguridad social - Funcionario',
      updates: {
        account: true,
        counterpart: true,
        percent: true,
      },
    },
    segSocEmp: {
      name: 'Aportes seguridad social - Empresa',
      updates: {
        account: true,
        counterpart: true,
        percent: true,
      },
    },
    riesgos: {
      name: 'Riesgos ARL',
      updates: {
        account: true,
        counterpart: true,
        percent: true,
      },
    },
    parafiscales: {
      name: 'Parafiscales',
      updates: {
        account: true,
        counterpart: true,
        percent: true,
      },
    },
    novedades: {
      name: 'Novedades',
      updates: {
        account: true,
        modality: true,
      },
    },
    ingresos: {
      name: 'Ingresos',
      updates: {
        account: true,
        check: true,
      },
      add: true,
    },
    egresos: {
      name: 'Egresos',
      updates: {
        account: true,
        check: true,
      },
      add: true,
    },
    liquidacion: {
      name: 'Liquidación',
      updates: {
        account: true,
      },
    },
  };

  peopleForm: FormGroup = new FormGroup({
    area: new FormControl('', [Validators.required]),
    person_id: new FormControl('', [Validators.required]),
  });

  incomeExpenses: FormGroup = new FormGroup({
    account_plan_id: new FormControl('', [Validators.required]),
    concept: new FormControl('', [Validators.required]),
    type: new FormControl(''),
  });

  people: any[] = [];

  account: any[] = [];

  data: any[] = [];

  typeModal: string = '';

  loading: boolean = true;

  constructor(
    private readonly nominaService: NominaConfigService,
    private readonly modalService: NgbModal,
    private readonly personService: PersonService,
    private readonly loanService: LoanService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getParametrosAll();
    this.getPeople();
    this.getPlains();
  }

  private getParametrosAll(titleChange?: string): void {
    this.loading = !titleChange;
    this.nominaService.getAllParams().subscribe((res: any) => {
      this.data = Object.entries(res.data);
      this.loading = false;
      let text = '';
      if (typeof res.data === 'object') {
        text = '';
      } else {
        text = res.data;
      }
      if (titleChange)
        this.swalService.show({
          icon: 'success',
          title: titleChange,
          text: text,
          showCancel: false,
          timer: 3000,
        });
    });
  }

  private getPeople(): void {
    this.personService.getPersonCompany().subscribe((r: any) => {
      this.people = r.data;
    });
  }

  private getPlains(): void {
    this.loanService.accountPlains().subscribe((r: any) => {
      this.account = r.data.map((account) => ({
        text: account['code'],
        value: account['id'],
      }));
    });
  }

  openModal(modalRef: TemplateRef<any>, name: string): void {
    this.typeModal = name;
    this.incomeExpenses.reset();
    const typeControl = this.incomeExpenses.get('type');
    if (name === 'ingresos') typeControl.setValidators([Validators.required]);
    else typeControl.clearValidators();
    typeControl.updateValueAndValidity();

    this.modalService.open(modalRef);
  }

  createManager(): void {
    this.swalService.confirm('Se agregará un nuevo responsable', {
      preConfirm: () => {
        return new Promise((resolve) => {
          this.nominaService
            .updateCreatePayrollManager(this.peopleForm.value)
            .subscribe((res: any) => {
              this.modalService.dismissAll();
              this.peopleForm.reset();
              this.getParametrosAll('Responsable de nómina');
            });
        });
      },
      showLoaderOnConfirm: true,
    });
  }

  createIncomeExpenses() {
    const type = this.typeModal;
    const params = {
      ...this.incomeExpenses.value,
      state: true,
      editable: false,
    };
    this.swalService.confirm(`Se agregará un nuevo ${type.toLowerCase()}`, {
      preConfirm: () => {
        return new Promise((resolve) => {
          if (type === 'ingresos') {
            delete params.type;
            this.createIncome(params);
            return;
          }
          this.createExpenses(params);
        });
      },
      showLoaderOnConfirm: true,
    });
  }

  private createIncome(params: Object): void {
    this.nominaService.updateCreateIngresos(params).subscribe((res: any) => {
      this.modalService.dismissAll();
      this.getParametrosAll('Ingresos');
    });
  }

  private createExpenses(params: Object): void {
    this.nominaService.updateCreateEgresos(params).subscribe((res: any) => {
      this.modalService.dismissAll();
      this.getParametrosAll('Egresos');
    });
  }
}

import { Component, Input } from '@angular/core';
import { NominaConfigService } from '../nomina-config.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Updates } from '../configuracion.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteMdlComponent } from '../../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { InputPositionInitialDirective } from '@app/core/directives/input-position-initial.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { consts } from '@app/core/utils/consts';

@Component({
  selector: 'app-configuracion-tabla',
  templateUrl: './configuracion-tabla.component.html',
  styleUrls: ['./configuracion-tabla.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    AutocompleteMdlComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    UpperCasePipe,
    NgxCurrencyDirective,
    InputPositionInitialDirective,
  ],
})
export class ConfiguracionTablaComponent {
  @Input() data: any[] = [];

  @Input() type: string = '';

  @Input() updates: Updates = {};

  @Input() people: any[] = [];

  @Input() account: any[] = [];

  options = consts.maskPorcentaje;

  restoreValue = {
    id: null,
    key: '',
  };

  constructor(
    private readonly nominaService: NominaConfigService,
    private readonly swalService: SwalService,
  ) {}

  private emptyRestoreValue(): void {
    this.restoreValue = {
      id: null,
      key: '',
    };
  }

  updateResponsible(person_id: number, payroll_manager_id: string): void {
    this.emptyRestoreValue();
    const params = {
      person_id,
      payroll_manager_id,
    };
    this.swalService
      .confirm('Se actualizará el responsable', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.nominaService.createUpdatePayrollManager(params).subscribe({
              next: (res: any) => {
                this.swalService.show({
                  title: 'Responsable de Nómina',
                  icon: 'success',
                  text: res.data,
                  showCancel: false,
                  timer: 1000,
                });
                resolve(true);
              },
              error: () => {
                this.swalService.hardError();
                resolve(false);
              },
            });
          });
        },
        showLoaderOnConfirm: true,
      })
      .then((r) => {
        if (r.isDismissed)
          this.restoreValue = {
            id: payroll_manager_id,
            key: 'people',
          };
      });
  }

  updateAccount(value: number, id: number): void {
    this.emptyRestoreValue();
    const params = {
      id,
      account_plan_id: value,
    };
    this.swalService
      .confirm('Se actualizará la cuenta contable', {
        preConfirm: () => {
          return new Promise((resolve) => {
            if (this.type === 'salarios') this.updateSalaries(params);
            else if (this.type === 'extras') this.updateOvertime(id, params);
            else if (this.type === 'segSocFunc') this.updateSocialSecurityOfficer(id, params);
            else if (this.type === 'segSocEmp') this.updateSocialSecurityCompany(id, params);
            else if (this.type === 'riesgos') this.updateRiskArl(id, params);
            else if (this.type === 'parafiscales') this.updateParafiscales(id, params);
            else if (this.type === 'novedades') this.updateNews(id, params);
            else if (this.type === 'ingresos') this.updateIncome(params);
            else if (this.type === 'egresos') this.updateExpenses(params);
            else if (this.type === 'liquidacion') this.updateLiquidation(params);
          });
        },
        showLoaderOnConfirm: true,
      })
      .then((r) => {
        if (r.isDismissed)
          this.restoreValue = {
            id: id,
            key: 'account',
          };
      });
  }

  updateCounterpart(value: number, id: number): void {
    this.emptyRestoreValue();
    const params = {
      id,
      account_setoff: value,
    };
    this.swalService
      .confirm('Se actualizará la contrapartida', {
        preConfirm: () => {
          return new Promise((resolve) => {
            if (this.type === 'salarios') this.updateSalaries(params);
            else if (this.type === 'segSocFunc') this.updateSocialSecurityOfficer(id, params);
            else if (this.type === 'segSocEmp') this.updateSocialSecurityCompany(id, params);
            else if (this.type === 'riesgos') this.updateRiskArl(id, params);
            else if (this.type === 'parafiscales') this.updateParafiscales(id, params);
          });
        },
        showLoaderOnConfirm: true,
      })
      .then((r) => {
        if (r.isDismissed)
          this.restoreValue = {
            id: id,
            key: 'counterpart',
          };
      });
  }

  updatePercentage(input: HTMLInputElement, id: number, currentValue: number): void {
    const params = {
      id,
      percentage: input.value,
    };
    this.swalService
      .confirm('Se actualizará el porcentaje', {
        preConfirm: () => {
          return new Promise((resolve) => {
            if (this.type === 'extras') this.updateOvertime(id, params);
            else if (this.type === 'segSocFunc') this.updateSocialSecurityOfficer(id, params);
            else if (this.type === 'segSocEmp') this.updateSocialSecurityCompany(id, params);
            else if (this.type === 'riesgos') this.updateRiskArl(id, params);
            else if (this.type === 'parafiscales') this.updateParafiscales(id, params);
          });
        },
        showLoaderOnConfirm: true,
      })
      .then((r) => {
        if (r.isDismissed) {
          input.value = String(currentValue ?? '');
        }
      });
  }

  updateModality(type: string, id: number, currentValue: string, matSelect: MatSelect): void {
    const params = {
      id,
      modality: type,
    };
    this.swalService
      .confirm('Se actualizará la modalidad', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.updateNews(id, params);
          });
        },
        showLoaderOnConfirm: true,
      })
      .then((r) => {
        if (r.isDismissed) {
          matSelect.value = currentValue;
        }
      });
  }

  updateIsActive(isActive: boolean, id: number, matSlide: MatSlideToggle): void {
    const params = {
      id,
      state: isActive,
    };
    this.swalService
      .confirm('Se actualizará el estado', {
        preConfirm: () => {
          return new Promise((resolve) => {
            if (this.type === 'ingresos') this.updateIncome(params);
            else if (this.type === 'egresos') this.updateExpenses(params);
          });
        },
        showLoaderOnConfirm: true,
      })
      .then((r) => {
        if (r.isDismissed) {
          matSlide.checked = !isActive;
        }
      });
  }

  private async updateSalaries(params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateCreateSalariosSubsidios(params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Salarios y subsidios',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }

  private async updateOvertime(id: number, params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateExtras(id, params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Horas Extras',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }

  private async updateSocialSecurityOfficer(id: number, params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateSSocialPerson(id, params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Seguridad Social Funcionario',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }

  private async updateSocialSecurityCompany(id: number, params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateSSocialCompany(id, params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Seguridad Social Empresa',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }

  private async updateRiskArl(id: number, params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateRiesgosArl(id, params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Riesgo ARL',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }

  private async updateParafiscales(id: number, params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateParafiscales(id, params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Egresos',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }

  private async updateNews(id: number, params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateNovedades(id, params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Novedades',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }

  private async updateIncome(params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateCreateIngresos(params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Ingresos',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }

  private async updateExpenses(params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateCreateEgresos(params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Egresos',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }

  private async updateLiquidation(params: object): Promise<boolean> {
    return new Promise((resolve) => {
      this.nominaService.updateCreateLiquidaciones(params).subscribe({
        next: (res: any) => {
          this.swalService.show({
            icon: 'success',
            title: 'Liquidación',
            text: res.data,
            showCancel: false,
            timer: 1000,
          });
          resolve(true);
        },
        error: () => {
          this.swalService.hardError();
          resolve(false);
        },
      });
    });
  }
}

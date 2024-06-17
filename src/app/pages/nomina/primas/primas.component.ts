import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { PrimasService } from './primas.service';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';

@Component({
  selector: 'app-primas',
  templateUrl: './primas.component.html',
  styleUrls: ['./primas.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltip,
    CurrencyPipe,
    StandardModule,
    HeaderButtonComponent,
    ActionViewComponent,
  ],
})
export class PrimasComponent implements OnInit {
  form: UntypedFormGroup;
  loading: boolean = false;
  @ViewChild('modalFuncionario') modalFuncionario: any;
  years: any[] = [];
  premiums: any[] = [];
  year = new Date().getFullYear();
  habilitarPagar: boolean = false;
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  yearControl = new FormControl(new Date().getFullYear().toString());

  loadingIndex = -1;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private _primas: PrimasService,
    private _swal: SwalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.getPrimasList();
    this.createForm();
    // this.getPrimasList();
    let year = new Date().getFullYear();
    for (let index = year - 5; index <= year; index++) {
      this.years.push(index);
    }
    this.habilitarBotonPagar();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    const { period } = this.urlFiltersService.currentFilters;
    this.yearControl.patchValue(period);
  }

  openConfirm() {
    //chequear que no exista prima en ese periodo
    let mes = new Date().getMonth();
    let semestre = 1;
    let lapso: string;
    if (mes <= 6) {
      semestre = 1;
      lapso = ' enero - junio ';
    } else {
      semestre = 2;
      lapso = ' julio - diciembre ';
    }
    let params = {
      periodo: semestre,
      yearSelected: this.year,
    };

    this._primas.checkBonuses(params.yearSelected + '-' + params.periodo).subscribe((res) => {
      //chequea en la DB si existe prima de este periodo
      if (res['data'] == null) {
        this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo, 0]);
      } else {
        //si existe, si está paga o no
        if (res['data']['status'] == 'pagado') {
          Swal.fire({
            title: 'Prima',
            html:
              'Ya se ha pagado las primas del ' +
              semestre +
              ' semestre (periodo: ' +
              lapso +
              ' ' +
              this.year +
              ').' +
              '<br>' +
              'Solo podrá visualizar',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#A3BD30',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            confirmButtonText: 'Sí, confirmar',
          }).then((res) => {
            if (res.isConfirmed) {
              this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo, 0]);
            }
          });
        } else {
          this._swal.show(
            {
              title: 'Prima',
              text: `Ya se ha generado un listado ¿Desea regenerar las primas del ${semestre} semestre ${params.yearSelected}?(periodo: ${lapso})`,
              icon: 'warning',
              showCancel: true,
            },
            (res: any) => {
              if (res) {
                if (res) {
                  this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo, 1]);
                }
              }
            },
          );
        }
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      year: ['', Validators.required],
      periodo: ['', Validators.required],
    });
  }

  getPrimasList() {
    this.loading = true;
    let params: any = {
      ...this.pagination,
    };
    const period = this.yearControl.value;
    if (period) params.period = period;
    this._primas.getPrimasPaginated(params).subscribe((r: any) => {
      this.loading = false;
      this.premiums = r.data.data;
      this.pagination.length = r.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  habilitarBotonPagar() {
    const hoy = new Date();
    const hoyMes = hoy.getMonth();

    // 0: Enero, 1: Febrere, 2: Marzo, 3: Abril,
    // 4: Mayo, 5: Junio, 6: Julio, 7: Agosto,
    // 8: Septiembre, 9: Octubre, 10: Noviembre, 11: Diciembre

    if (hoyMes == 5 || hoyMes == 6 || hoyMes == 11 || hoyMes == 0) {
      this.habilitarPagar = true;
    } else {
      this.habilitarPagar = false;
    }
  }

  VerPrimaFuncionarios(period, index: number) {
    this.loadingIndex = index;
    let params = {
      period: period,
      yearSelected: period.split('-')[0],
      periodo: period.split('-')[1],
    };
    this._primas.setBonus(params).subscribe((r: any) => {
      if (r.data != null) {
        this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo, 1]);
      }
    });
  }
}

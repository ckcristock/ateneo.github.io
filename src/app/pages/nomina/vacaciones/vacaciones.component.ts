import { Component, OnInit, ViewChild } from '@angular/core';
import { VacacionesService } from './vacaciones.service';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import moment from 'moment';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { ImagePipe } from '../../../core/pipes/image.pipe';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ModalBasicComponent } from '../../../components/modal-basic/modal-basic.component';
import { NgbTooltip, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, TitleCasePipe, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbTooltip,
    NgbPagination,
    ModalBasicComponent,
    NotDataComponent,
    TitleCasePipe,
    CurrencyPipe,
    DatePipe,
    ImagePipe,
  ],
})
export class VacacionesComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  vacations: any[] = [];
  vacation: any = {};
  valor: any;
  daysDiference: any;
  days: any;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0,
  };
  constructor(
    private _vacations: VacacionesService,
    private fb: UntypedFormBuilder,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.getVacations();
  }

  openModal() {
    this.modal.show();
  }

  vacationData(vacation) {
    this.vacation = { ...vacation };
    this.calcularDias(); // La función se llama justo aca para que calcule los dias antes de hacer la operación.
    this.valor = (this.vacation.salary * this.daysDiference) / 30;
  }

  calcularDias() {
    let date_start = new Date(this.vacation.date_start); // Fecha inicial
    let date_end = new Date(this.vacation.date_end); // Fecha final
    let timeDiff = Math.abs(date_start.getTime() - date_end.getTime());
    this.daysDiference = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Días entre las dos fechas
    let sundays = 0; //Número Domingos
    let array = new Array(this.daysDiference);
    for (let i = 0; i < this.daysDiference; i++) {
      if (date_start.getDay() == 0) {
        sundays++;
      }
      date_start.setDate(date_start.getDate() + 1);
    }
    this.days = this.daysDiference - sundays; // Dias de Vacaciones sin contar los domingos.
    return sundays;
  }

  getVacations(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._vacations.getVacations().subscribe((r: any) => {
      this.vacations = r.data.data;
      this.pagination.collectionSize = r.total;
      this.loading = false;
    });
  }

  saveInformation(state) {
    let value = this.valor;
    let payroll_factor_id = this.vacation.id;
    let days = this.days;
    let data = {
      value,
      state,
      payroll_factor_id,
      days,
    };
    this._vacations.saveInformation(data).subscribe((r: any) => {
      this.modal.hide();
      this.getVacations();
      this._swal.show({
        icon: 'success',
        title: 'Vacación Pagada',
        text: '',
        showCancel: false,
      });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { LoanService } from './loan.service';
import { Observable } from 'rxjs';
import { DatePipe, DecimalPipe, AsyncPipe } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalprestamoylibranzacrearComponent } from './modalprestamoylibranzacrear/modalprestamoylibranzacrear.component';
import { LoadImageComponent } from '../../../shared/components/load-image/load-image.component';
import { AutocompleteMdlComponent } from '../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { GlobalService } from '@shared/services/global.service';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-prestamos-libranzas',
  templateUrl: './prestamos-libranzas.component.html',
  styleUrls: ['./prestamos-libranzas.component.scss'],
  standalone: true,
  imports: [
    AutocompleteMdlComponent,
    DatePickerComponent,
    LoadImageComponent,
    DecimalPipe,
    DatePipe,
    StandardModule,
    AddButtonComponent,
    ActionButtonComponent,
    AsyncPipe,
  ],
})
export class PrestamosLibranzasComponent implements OnInit {
  public Prestamos: any[] = [];
  public loading: boolean = false;
  people$ = new Observable();
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  filters: any = {
    person_id: '',
    date: '',
  };
  date: { year: number; month: number };

  companyId: number = 0;

  indexDownload = -1;

  constructor(
    private _loan: LoanService,
    private readonly _userService: UserService,
    private readonly modalService: NgbModal,
    private readonly globalService: GlobalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.companyId = this._userService.user.person.company_worked.id;
  }

  ngOnInit() {
    this.people$ = this.globalService.getAllPeople$;
    this.getUrlFilters();
    this.listaPrestamo();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  selectedDate(dates: DatePicker) {
    this.filters = { ...this.filters, ...dates };
    this.listaPrestamo();
  }

  abrirModalPrestamo() {
    const modalRef = this.modalService.open(ModalprestamoylibranzacrearComponent);
    modalRef.componentInstance.recargarLista.subscribe({
      next: () => {
        console.log('enter subscribe');

        this.listaPrestamo();
      },
    });
  }

  listaPrestamo() {
    !this.filters.person_id ? (this.filters.person_id = '') : '';
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.filters,
    };
    this._loan.getAll(params).subscribe((r: any) => {
      this.Prestamos = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  downloadPDF(id) {
    this.indexDownload = id;
    this._loan.download(id, this.companyId).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'proyeccion';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.loading = false;
      this.indexDownload = -1;
    }),
      (error) => {
        this.loading = false;
        this.indexDownload = -1;
      },
      () => {
        this.loading = false;
      };
  }

  downloadExcel(id) {
    this.indexDownload = id;
    this._loan.downloadExcel(id, this.companyId).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = 'proyeccion';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
      this.loading = false;
      this.indexDownload = -1;
    }),
      (error) => {
        this.loading = false;
        this.indexDownload = -1;
      },
      () => {
        this.loading = false;
      };
  }

  downloadPaz(id) {
    this.indexDownload = id;
    this._loan.downloadPaz(id, this.companyId).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'pazysalvo';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.loading = false;
      this.indexDownload = -1;
    }),
      (error) => {
        this.loading = false;
        this.indexDownload = -1;
      },
      () => {
        this.loading = false;
      };
  }
}

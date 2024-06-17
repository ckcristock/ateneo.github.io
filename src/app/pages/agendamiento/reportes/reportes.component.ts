import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DataDinamicService } from '../../../services/data-dinamic.service';
import { ReportesService } from './reportes.service';
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AutocompleteMdlComponent } from '@app/components/autocomplete-mdl/autocomplete-mdl.component';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    NgSelectModule,
    NgIf,
    MatInputModule,
    CardComponent,
    AutocompleteMdlComponent,
    DatePickerComponent,
  ],
})
export class ReportesComponent implements OnInit {
  companies: Array<any>;
  specialities: Array<any>;
  typeRegimens: Array<any>;
  epss: Array<any>;
  selected: any;
  hidden: boolean = true;
  loading = false;

  specialty = '';
  institution = '';
  /* @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
   */
  typeReportDefault = 'Reporte de atenciones';
  identifier: any;
  typeReports = [
    'Reporte de atenciones',
    'Reporte de agendas',
    'Reporte de estado de agendas',
    'Reporte de lista de espera',
  ];
  show_input: boolean = false;

  rangeDate = {};

  constructor(
    private _dataDinamic: DataDinamicService,
    private _reportes: ReportesService,
  ) {
    this.getCompanies();
    this.getSpecialities();
    this.getRegimens();
    this.getEpss();
    this.gettypeReportes();
  }

  ngOnInit(): void {}

  getCompanies() {
    this._dataDinamic.getCompanies().subscribe((r: any) => {
      this.companies = r.data;
      this.companies.unshift({ text: 'Todas', value: '' });
    });
  }

  gettypeReportes() {
    this._dataDinamic.gettypeReportes().subscribe((r: any) => {
      if (r.length != 0) {
        this.typeReports = r;
      }
    });
  }

  getSpecialities() {
    this._dataDinamic.getSpecialties('', '').subscribe((r: any) => {
      this.specialities = r.data;
      this.specialities.unshift({ text: 'Todas', value: '' });
    });
  }

  getRegimens() {
    this._dataDinamic.getRegimens().subscribe((req: any) => {
      this.typeRegimens = req.data;
      this.typeRegimens.unshift({ text: 'Todos', value: '' });
    });
  }
  getEpss() {
    this._dataDinamic.getEps().subscribe((req: any) => {
      this.epss = req.data;
      this.epss.unshift({ text: 'Todas', value: '' });
    });
  }

  showInput() {
    let currentTypeReport = this.typeReports.find((type) => {
      return type['text'] == this.typeReportDefault;
    });
    this.show_input = Boolean(currentTypeReport['show_input']);
  }

  selectedDate(dates: DatePicker) {
    this.rangeDate = {
      date_start: dates.start_date,
      date_end: dates.end_date,
    };
  }

  download(form: NgForm) {
    this.loading = true;
    const body = {
      ...form.value,
      ...this.rangeDate,
      company_id: this.institution,
      speciality_id: this.specialty,
    };
    this._reportes.download(body).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/xlsx' });
      var filename = 'Reporte' + new Date();
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      link.download = `${filename}.xlsx`;
      link.click();
      this.loading = false;
    }),
      (error) => {
        this.loading = false;
      },
      () => {
        console.info('File downloaded successfully');
        this.loading = false;
      };
  }
}

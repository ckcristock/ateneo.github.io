import { Component, OnInit } from '@angular/core';
// import { IOption } from 'ng-select';
import { HttpClient } from '@angular/common/http';
// import { Globales } from '../../shared/globales/globales';
import { environment } from 'src/environments/environment';
// import { IMyDrpOptions, IMyDateRange } from 'mydaterangepicker';
import { GeneralService } from '../../services/general.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// import { SwalService } from '../../shared/services/swal/swal.service';
import { UserService } from 'src/app/core/services/user.service';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgSelectModule,
    MatIconModule,
    NgbDropdownModule,
    NgbPaginationModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  providers: [GeneralService],
  selector: 'app-reporteauditorias',
  templateUrl: './reporteauditorias.component.html',
  styleUrls: ['./reporteauditorias.component.scss'],
})
export class ReporteauditoriasComponent implements OnInit {
  public puntos: any;
  public funcionario: any = this.userService.user.id;

  constructor(
    private http: HttpClient,
    // public globales: Globales,
    private _generalService: GeneralService,
    private swalService: SwalService,
    private readonly userService: UserService,
  ) {}

  public Filtros: any = {
    fechas: '',
    punto_dispensacion: '',
  };

  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  datePipe = new DatePipe('es-CO');

  // public myDateRangePickerOptions: IMyDrpOptions = {
  //   width: '100%',
  //   height: '20px',
  //   selectBeginDateTxt: 'Inicio',
  //   selectEndDateTxt: 'Fin',
  //   selectionTxtFontSize: '10px',
  //   dateFormat: 'yyyy-mm-dd',
  // };

  ngOnInit() {
    this.http
      .get(environment.ruta + 'php/inventariopuntos/lista_punto_funcionario.php', {
        params: { id: this.funcionario },
      })
      .subscribe((data: any) => {
        this.puntos = data.Puntos;
        this.puntos.unshift({
          value: 'todos',
          label: 'TODOS',
        });
      });
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end);
      }
    });
  }

  dateRangeChanged(event: any) {
    if (event.formatted != '') {
      this.Filtros.fechas = event.formatted;
    } else {
      this.Filtros.fechas = '';
    }
  }

  selectedDate(start, end) {
    if (start && end) {
      this.Filtros.fechas =
        this.datePipe.transform(start, 'yyyy-MM-dd') +
        ' - ' +
        this.datePipe.transform(end, 'yyyy-MM-dd');
    } else this.Filtros.fechas = '';
  }

  private _setFiltros() {
    let params: any = {};

    if (this.Filtros.fechas.trim() != '') {
      params.fechas = this.Filtros.fechas;
    }

    if (this.Filtros.punto_dispensacion != '') {
      params.punto = this.Filtros.punto_dispensacion;
    }

    return params;
  }
  public DescargarReporte() {
    if (this.Filtros.fechas != '') {
      let p = this._setFiltros();
      let queryString = Object.keys(p)
        .map((key) => key + '=' + p[key])
        .join('&');

      window.open(
        this._generalService.Ruta_Principal + 'php/auditorias/reporte_auditoria.php?' + queryString,
        '_blank',
      );
    } else {
      this.swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe escoger las fechas para la consulta!',
      ]);
    }
  }
  borrarFechas() {
    if (this.range.get('start').value && this.range.get('end').value) {
      this.range.setValue({
        start: null,
        end: null,
      });
      this.selectedDate(null, null);
    }
  }
}

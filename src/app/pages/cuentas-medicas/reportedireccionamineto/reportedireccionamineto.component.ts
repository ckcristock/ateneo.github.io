import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteMdlComponent } from '../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-reportedireccionamineto',
  templateUrl: './reportedireccionamineto.component.html',
  styleUrls: ['./reportedireccionamineto.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    AutocompleteMdlComponent,
    MatInputModule,
  ],
})
export class ReportedireccionaminetoComponent implements OnInit {
  public Filtros: any = {
    Fechas: '',
    Departamento: '',
    Punto: '',
    Eps: '',
    Estado: '',
    Cum: '',
  };
  myDateRangePickerOptions: any = {
    width: '170px',
    height: '22px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '14px',
    dateFormat: 'yyyy-mm-dd',
  };
  public Puntos: Array<any>;
  public Departamentos: any[] = [];
  public Eps: any[] = [];

  globales = environment;

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  constructor(
    private http: HttpClient,
    private _swalService: SwalService,
  ) {}

  ngOnInit() {
    this.http
      .get(this.globales.ruta + 'php/reportes/eps_departamentos.php')
      .subscribe((data: any) => {
        this.Departamentos = data.Departamento;
        this.Eps = data.Eps;
      });
  }

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.Filtros.fecha = `${formatDate(this.formRange.value.start as string)} - ${formatDate(
      this.formRange.value.end as string,
    )}`;
  }

  dateRangeChanged(event) {
    this.Filtros.Fechas = event.formatted;
  }
  cargarPuntos(id_dep) {
    if (id_dep != '') {
      this.http
        .get(this.globales.ruta + 'php/reportes/puntos.php', { params: { id_dep: id_dep } })
        .subscribe((data: any) => {
          this.Puntos = data;
          let todos: any = { value: 0, label: 'Todos' };
          this.Puntos.unshift(todos);
        });
    }
  }
  downloadReporte() {
    let params: any = {};

    if (this.Filtros.Fechas != '') {
      params.fechas = this.Filtros.Fechas.replace('-', '%2D');
    }
    if (this.Filtros.Departamento != '') {
      params.dep = this.Filtros.Departamento;
    }
    if (this.Filtros.Punto != '') {
      params.pto = this.Filtros.Punto;
    }

    if (this.Filtros.Eps != '') {
      params.nit = this.Filtros.Eps;
    }

    if (this.Filtros.Estado != '') {
      params.estado = this.Filtros.Estado;
    }
    if (this.Filtros.Cum != '') {
      params.cum = this.Filtros.Cum;
    }

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    if (queryString != '?' && this.Filtros.Fechass != '' && this.Filtros.Departamento != '') {
      console.log(queryString);

      //window.open(this.globales.ruta+'php/dispensaciones/reporte_disp_plano.php'+queryString, '_blank');
      window.open(
        this.globales.ruta + 'php/mipres/reporte_direccionamiento.php' + queryString,
        '_blank',
      );
    } else {
      this._swalService.show({
        icon: 'warning',
        title: 'Alerta',
        text: 'Debe ingresar al menos un parámetro para el Reporte de Direccionamiento, el rango de Fechas y el Departamento es obligatorio!',
        showCancel: false,
      });
    }
  }
}

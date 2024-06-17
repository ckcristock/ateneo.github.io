import { Component, OnInit } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { GeneralService } from 'src/app/services/general.service';
import { BodeganuevoService } from '../../services/bodeganuevo.service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-reporteajusteinventario',
  templateUrl: './reporteajusteinventario.component.html',
  styleUrls: ['./reporteajusteinventario.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class ReporteajusteinventarioComponent implements OnInit {
  public BodegasPuntos: Array<any> = [];
  public BodegaPunto: string = 'Bodega/Punto';
  private _fechasDeshabilitadas: Array<any> = [
    { beginDate: { year: 2000, month: 1, day: 1 }, endDate: { year: 2019, month: 4, day: 13 } },
  ];
  public myDateRangePickerOptions: any = {
    width: '100%',
    height: '20px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
    disableDateRanges: this._fechasDeshabilitadas,
  };

  public Filtros: any = {
    fechas: '',
    tipo: '',
    origen: '',
    id: '',
  };

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  constructor(
    private _generalService: GeneralService,
    private _swalService: SwalService,
    private _bodegaService: BodeganuevoService,
  ) {}

  ngOnInit() {}

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.Filtros.fechas = `${formatDate(this.formRange.value.start as string)} - ${formatDate(
      this.formRange.value.end as string,
    )}`;
  }

  private _setFiltros() {
    let params: any = {};

    if (this.Filtros.fechas.trim() != '') {
      params.fechas = this.Filtros.fechas;
    }

    if (this.Filtros.tipo.trim() != '') {
      params.tipo = this.Filtros.tipo;
    }

    if (this.Filtros.origen.trim() != '') {
      params.origen = this.Filtros.origen;
    }

    if (this.Filtros.id.trim() != '') {
      params.id = this.Filtros.id;
    }

    return params;
  }

  public dateRangeChanged(event: any) {
    if (event.formatted != '') {
      this.Filtros.fechas = event.formatted;
    } else {
      this.Filtros.fechas = '';
    }
  }

  public DescargarReporte() {
    if (this.Filtros.fechas != '') {
      let p = this._setFiltros();

      let queryString = Object.keys(p)
        .map((key) => key + '=' + p[key])
        .join('&');

      window.open(
        environment.ruta + 'php/ajusteindividual/reporte_ajuste_individual.php?' + queryString,
        '_blank',
      );
    } else {
      this._swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe escoger las fechas para la consulta!',
      ]);
    }
  }

  public ConsultaBodegaPunto() {
    this.SetTituloSelect();
    if (this.Filtros.origen != '') {
      this._bodegaService.getBodegasPuntos(this.Filtros.origen).subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.BodegasPuntos = data.query_result;
        } else {
          this.BodegasPuntos = [];
          let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
          // this._toastService.ShowToast(toastObj);
        }
      });
    } else {
      this.BodegasPuntos = [];
    }
  }

  public SetTituloSelect() {
    this.BodegaPunto = this.Filtros.origen == '' ? 'Bodega/Punto' : this.Filtros.origen;
  }
}

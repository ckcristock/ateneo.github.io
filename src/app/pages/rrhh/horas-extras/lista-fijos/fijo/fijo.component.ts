import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { ExtraHoursService } from '../../extra-hours.service';
import { TimePipe } from '../../../../../core/pipes/time.pipe';
import { ImagePipe } from '../../../../../core/pipes/image.pipe';
import { EditDiarioFixedComponent } from '../edit-diario-fixed/edit-diario-fixed.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, UpperCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-fijo',
  templateUrl: './fijo.component.html',
  styleUrls: ['./fijo.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FormsModule,
    EditDiarioFixedComponent,
    UpperCasePipe,
    DatePipe,
    ImagePipe,
    TimePipe,
  ],
})
export class FijoComponent implements OnInit {
  @Input('diario') diario;
  @Input('person') person;
  @Input('extras') extras;
  @Output('updateDates') updateDates = new EventEmitter<any>();
  @Output('data') data = new EventEmitter<any>();

  funcionarioDato: any;
  diarioDato: any;
  turnoDato: any = {};
  lista: any = {};
  extrasValidadas: any = {};
  validada = false;
  esVisible = false;

  constructor(
    private _swal: SwalService,
    private _extra: ExtraHoursService,
  ) {}

  ngOnInit(): void {
    let aux = {
      ht: 0,
      hed: 0,
      hen: 0,
      heddf: 0,
      hendf: 0,
      hrn: 0,
      hrddf: 0,
      hrndf: 0,
    };
    if (this.extras != '' && this.extras != undefined) {
      //('si trabajó ese día')
      if (this.extras.extras !== 'No hay asistencia este día') {
        aux = Object.assign(this.extras.hours_extra, this.extras.hours_recharge);
      }
    }
    this.lista = {
      horasTurno: this.extras?.hours_schedule?.horas,
      horasTrabajadas: aux.ht,
      horasExtrasDiurnas: aux.hed,
      horasExtrasNocturnas: aux.hen,
      horasExtrasDiurnasFestivasDom: aux.heddf,
      horasExtrasNocturnasFestivasDom: aux.hendf,
      recargosNocturnos: aux.hrn,
      recargosFestivos: aux.hrddf,
      recargosNocturnosFestivos: aux.hrndf,
      person_id: this.person.id,
      date: this.extras?.date,
      validada: this.validada,
    };
    this.funcionarioDato = this.person;
    this.cargarExtrasValidadas(this.funcionarioDato.id);
    this.relacionarConHoraTurno();
    this.asignacionDatosReales();
    this.diarioDato = this.diario;
    this.data.emit(this.lista);
  }

  get hasDay() {
    return this.diario['0']?.day;
  }

  guardarReporteDeExtras() {
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Vas a realizar la validación de las horas extras del funcionario, confirma que todo coincida correctamente pues esto afectará los cálculos de nómina.',
        icon: 'warning',
      })
      .then((res) => {
        if (res.isConfirmed) {
          let reporte = {
            person_id: this.funcionarioDato.id,
            date: this.diario['0']?.day.date,
            ht: this.lista.horasTrabajadas,
            hed: this.lista.horasExtrasDiurnas,
            hen: this.lista.horasExtrasNocturnas,
            heddf: this.lista.horasExtrasDiurnasFestivasDom,
            hendf: this.lista.horasExtrasNocturnasFestivasDom,
            hrndf: this.lista.recargosNocturnosFestivos,
            hrn: this.lista.recargosNocturnos,
            hrddf: this.lista.recargosFestivos,

            hed_reales: this.lista.horasExtrasDiurnasReales,
            hen_reales: this.lista.horasExtrasNocturnasReales,
            hedfd_reales: this.lista.horasExtrasDiurnasFestivasDomReales,
            hedfn_reales: this.lista.horasExtrasNocturnasFestivasDomReales,
            rn_reales: this.lista.recargosNocturnosReales,
            rf_reales: this.lista.recargosFestivosReales,
            rnf_reales: this.lista.recargosNocturnosFestivosReales,
          };

          if (this.validada === true) {
            //Actualizar
            this._extra.updateExtraHours(this.extrasValidadas.id, reporte).subscribe(this.res);
          } else {
            this._extra.createExtraHours(reporte).subscribe(this.res);
          }
          //Actualizar datos en vista
        } else {
          this._swal.show({
            title: 'Ocurrió un error',
            text: 'No fue confirmado',
            icon: 'error',
            showCancel: false,
          });
        }
      });
  }

  res = (r: any) => {
    if (r.status) {
      this._swal.show({
        title: 'Guardado con éxito',
        text: `La validación de horas extras para ${this.funcionarioDato.first_name} se generó con éxito`,
        icon: 'success',
        showCancel: false,
      });
      this.cargarExtrasValidadas(this.funcionarioDato.id);
    } else {
      this._swal.show({
        title: 'Ha ocurrido un error en el status',
        text: r.err,
        icon: 'error',
        showCancel: false,
      });
    }
  };

  mostrarModalDiarioFijo(diario) {}

  cargarExtrasValidadas(funcionario) {
    if (this.hasDay) {
      this._extra
        .getExtraHoursValids(funcionario, this.diario['0']?.day.date)
        .subscribe((r: any) => {
          this.extrasValidadas = r.data ?? {};
          if (this.extrasValidadas) {
            if (this.hasDay && this.extrasValidadas.date === this.diario['0']?.day.date) {
              this.validada = true;
            }
            if (this.validada) {
              this.lista.horasTrabajadas = this.extrasValidadas.ht;
              this.lista.horasExtrasDiurnas = this.extrasValidadas.hed;
              this.lista.horasExtrasNocturnas = this.extrasValidadas.hen;
              this.lista.horasExtrasDiurnasFestivasDom = this.extrasValidadas.heddf;
              this.lista.horasExtrasNocturnasFestivasDom = this.extrasValidadas.hendf;
              this.lista.recargosNocturnos = this.extrasValidadas.hrn;
              this.lista.recargosFestivos = this.extrasValidadas.hrddf;
              this.lista.recargosNocturnosFestivos = this.extrasValidadas.hrndf;

              this.lista.horasExtrasDiurnasReales = this.extrasValidadas.hed_reales;
              this.lista.horasExtrasNocturnasReales = this.extrasValidadas.hen_reales;
              this.lista.horasExtrasDiurnasFestivasDomReales = this.extrasValidadas.hedfd_reales;
              this.lista.horasExtrasNocturnasFestivasDomReales = this.extrasValidadas.hedfn_reales;
              this.lista.recargosNocturnosReales = this.extrasValidadas.rn_reales;
              this.lista.recargosFestivosReales = this.extrasValidadas.rf_reales;
              this.lista.recargosNocturnosFestivosReales = this.extrasValidadas.rnf_reales;
              this.lista.validada = this.validada;
            }
          }
        });
    }
  }

  relacionarConHoraTurno() {
    this.turnoDato = this.diario.turnoOficial;
  }

  asignacionDatosReales() {
    this.lista.horasExtrasDiurnasReales = this.lista.horasExtrasDiurnas;
    this.lista.horasExtrasNocturnasReales = this.lista.horasExtrasNocturnas;
    this.lista.horasExtrasDiurnasFestivasDomReales = this.lista.horasExtrasDiurnasFestivasDom;
    this.lista.horasExtrasNocturnasFestivasDomReales = this.lista.horasExtrasNocturnasFestivasDom;
    this.lista.recargosFestivosReales = this.lista.recargosFestivos;
    this.lista.recargosNocturnosReales = this.lista.recargosNocturnos;
    this.lista.recargosNocturnosFestivosReales = this.lista.recargosNocturnosFestivos;
  }

  saved() {
    //this.calcularHorasTrabajadas();
    this.updateDates.emit();
  }
}

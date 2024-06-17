import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { ExtraHoursService } from '../../extra-hours.service';
import { FijoComponent } from '../fijo/fijo.component';
import { TimePipe } from '../../../../../core/pipes/time.pipe';
import { ImagePipe } from '../../../../../core/pipes/image.pipe';
import { EditDiarioRotatingComponent } from '../edit-diario-rotating/edit-diario-rotating.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, UpperCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-rotativo',
  templateUrl: './rotativo.component.html',
  styleUrls: ['./rotativo.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FormsModule,
    EditDiarioRotatingComponent,
    UpperCasePipe,
    DatePipe,
    ImagePipe,
    TimePipe,
  ],
})
export class RotativoComponent implements OnInit {
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
    this.funcionarioDato = this.person.id;
    this.diarioDato = this.diario;
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
    this.cargarExtrasValidadas(this.funcionarioDato, this.diarioDato['date']); //se elimino la asignacion previa de HE
    this.relacionarConHoraTurno();
    this.asignacionDatosReales();
    this.data.emit(this.lista);
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
            person_id: this.funcionarioDato,
            date: this.diarioDato.date,
            ht: this.lista.horasTrabajadas,
            hed: this.lista.horasExtrasDiurnas,
            hen: this.lista.horasExtrasNocturnas,
            hedfd: this.lista.horasExtrasDiurnasFestivasDom,
            hedfn: this.lista.horasExtrasNocturnasFestivasDom,
            hrn: this.lista.recargosNocturnos,
            hrddf: this.lista.recargosFestivos,
            hrndf: this.lista.recargosNocturnosFestivos,
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
            text: '',
            icon: 'error',
            showCancel: false,
          });
          this.cargarExtrasValidadas(this.person.id, this.diarioDato['date']);
        }
      });
  }

  res = (r: any) => {
    if (r.status) {
      this._swal.show({
        title: 'Guardado con éxito',
        text: `La validación de horas extras para ${this.person.first_name} se generó con éxito`,
        icon: 'success',
        showCancel: false,
      });
      this.cargarExtrasValidadas(this.person.id, this.diarioDato['date']);
    } else {
      this._swal.show({
        title: 'Ocurrió un error de status',
        text: r.err,
        icon: 'error',
        showCancel: false,
      });
    }
  };

  mostrarModalDiarioFijo(diario) {}

  cargarExtrasValidadas(funcionario, fecha) {
    if (fecha != undefined) {
      this._extra.getExtraHoursValids(funcionario, fecha).subscribe((r: any) => {
        if (r.status) {
          this.extrasValidadas = r.data ?? {};
          this.validada =
            this.extrasValidadas.date === fecha
              ? //this.extrasValidadas.date === this.diarioDato[0]?.day?.date
                true
              : false;
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
    this.turnoDato = this.diario;
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

  //esta función es para modificar el horario, que a la fecha (13-01-2023) no se debe realizar
  //
  saved() {
    this.updateDates.emit();
  }
}

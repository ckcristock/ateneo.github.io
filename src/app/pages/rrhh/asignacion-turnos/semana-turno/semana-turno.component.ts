import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import moment from 'moment';
import { AsignacionTurnosService } from '../asignacion-turnos.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { FormsModule } from '@angular/forms';
import { LoadImageComponent } from '../../../../shared/components/load-image/load-image.component';
import { NgIf, NgFor, NgStyle, TitleCasePipe } from '@angular/common';
import { TurnoComponent } from './turno/turno.component';

@Component({
  selector: 'app-semana-turno',
  templateUrl: './semana-turno.component.html',
  styleUrls: ['./semana-turno.component.scss'],
  standalone: true,
  imports: [
    TurnoComponent,
    NgIf,
    NgFor,
    LoadImageComponent,
    FormsModule,
    NgStyle,
    NotDataComponent,
    TitleCasePipe,
  ],
})
export class SemanaTurnoComponent implements OnInit {
  @Input('turnosRotativos') turnosRotativos;
  @Input('diaInicial') diaInicial;
  @Input('diaFinal') diaFinal;
  @Input('people') people;
  @Input('changeWeek') changeWeek: EventEmitter<any>;
  masiveTurnId: any = {};
  diaInicialSemana: any;
  diaFinalSemana: any;
  diasSemana: any[] = [];
  horariosExistentes: any[] = [];
  turnos: any[] = [];
  loading: boolean = true;
  today = new Date();
  hoy = new Date();
  DIA_EN_MILISEGUNDOS = 24 * 60 * 60 * 1000;
  ayer = new Date(this.hoy.getTime() - this.DIA_EN_MILISEGUNDOS);
  constructor(
    private _asignacion: AsignacionTurnosService,
    private _swal: SwalService,
  ) {}

  async ngOnInit() {
    this.changeWeek.subscribe(async (d: any) => {
      this.diasSemana = [];
      this.diaInicial = d.diaInicialSemana;
      this.diaFinal = d.diaFinalSemana;
      this.diaInicialSemana = this.diaInicial;
      this.diaFinalSemana = this.diaFinal;
      this.turnos = this.turnosRotativos.data;
      await this.fillDiasSemana();
      this.loading = false;
    });
  }
  checkAll(ev) {
    this.people.forEach((x) => (x.selected = ev.target.checked));
  }

  isAllChecked() {
    return this.people.every((_) => _.selected);
  }

  turnAllChanged(turnId) {
    let turn = this.turnos.find((r) => r.id == turnId);
    if (turn) {
      this.masiveTurnId = turn;
    } else {
      this.masiveTurnId = {};
    }
    this.masiveTurnId.rotating_turn_id = turnId;
    this.masiveTurnId = this.getColors(this.masiveTurnId);
  }
  asignarHorariosMasivo() {
    if (this.masiveTurnId.rotating_turn_id != 'seleccione') {
      this.people.forEach((r) => {
        if (r.selected) {
          r.diasSemana.forEach((dia) => {
            if (new Date(dia.fecha) > this.ayer) {
              if (dia.dia == 'domingo') {
                let turnId = this.masiveTurnId?.sunday?.id ? this.masiveTurnId?.sunday?.id : 0;
                dia.turno = turnId;
                dia.color = turnId ? this.masiveTurnId.sunday.color : 'black';
                return;
              }
              if (dia.dia == 'sábado') {
                let turnId = this.masiveTurnId?.saturday?.id ? this.masiveTurnId?.saturday?.id : 0;
                dia.turno = turnId;
                dia.color = turnId ? this.masiveTurnId.saturday.color : 'black';
                return;
              } else {
                dia.turno = this.masiveTurnId.rotating_turn_id;
                dia.color = this.masiveTurnId.color;
              }
            }
          });
        }
      });
    }
  }

  async fillDiasSemana() {
    this.diaInicialSemana =
      typeof this.diaInicialSemana == 'string'
        ? (this.diaInicialSemana = moment(this.diaInicialSemana))
        : this.diaInicialSemana;

    this.diaInicial =
      typeof this.diaInicial == 'string' ? moment(this.diaInicial) : this.diaInicial;

    this.diaFinal = typeof this.diaFinal == 'string' ? moment(this.diaFinal) : this.diaFinal;

    this.diaInicialSemana.locale('es');
    this.diaInicial.locale('es');
    while (this.diaInicial <= this.diaFinal) {
      let dia = this.diaInicial.format('dddd');

      let pur = {
        dia,
        fecha: this.diaInicial.format('YYYY-MM-DD'),
        color: dia == 'domingo' ? 'black' : '#9da4ad',
        turno: dia == 'domingo' ? 0 : 'seleccione',
      };

      this.diasSemana.push(pur);
      this.diaInicial = moment(this.diaInicial).add(1, 'd');
    }

    await this.people.forEach((p, i) => {
      let sem = [...this.diasSemana];
      p.diasSemana = [];
      p.diasSemana = sem.map((acc) => {
        return Object.assign({}, acc);
      });

      p.fixed_turn_hours.forEach((turn) => {
        turn = this.getColors(turn, true);
        p.diasSemana.forEach((dia, i) => {
          if (turn.date == dia.fecha) {
            dia.turno = turn.rotating_turn_id;
            dia.color = turn.color;
          }
        });
      });
    });
  }

  getColors(turn: any, findColor = false) {
    if (turn.rotating_turn_id && turn.rotating_turn_id == 0) {
      turn.color = 'black';
      return turn;
    }

    if (turn.rotating_turn_id === 'seleccione') {
      turn.color = '#9da4ad';

      return turn;
    }

    if (!turn.rotating_turn_id) {
      turn.color = '#000';
    } else if (findColor) {
      turn.color = this.turnos.find((turno) => turno.id == turn.rotating_turn_id)?.color;
    }
    return turn;
  }

  getColorByDay(dia) {
    if (dia.turno == 0) {
      dia.color = '#000';
    } else {
      dia.color = this.turnos.find((turno) => turno.id == dia.turno).color;
    }
  }

  formatFecha(fecha) {
    return moment(fecha).format('DD/MM/YYYY');
  }

  getFecha(fecha) {
    return new Date(fecha);
  }

  makeHorario() {
    const horarios = [];
    this.people.forEach((funcionario) => {
      funcionario.diasSemana.forEach((dia) => {
        const { turno, fecha } = dia;
        const fechaDia = new Date(fecha);
        if (turno && turno !== 'seleccione' && fechaDia > this.ayer) {
          horarios.push({
            person_id: funcionario.id,
            rotating_turn_id: turno,
            date: fecha,
            weeks_number: moment().format('ww'),
          });
        }
      });
    });
    if (horarios.length) {
      const request = () => {
        this._asignacion.saveHours(horarios).subscribe({
          next: () => {
            this._swal.success('Horarios asignados correctamente');
          },
          error: () => {
            this._swal.hardError();
          },
        });
      };
      this._swal.swalLoading('Vamos a asignar horarios', request);
    } else {
      this._swal.incompleteError();
    }
  }

  turnChanged(turno, person, day) {
    let index = this.diasSemana.indexOf(day);
    if (person.dias) {
    } else {
      person.dias = {};
    }
    person.dias[index] = turno;
  }
}

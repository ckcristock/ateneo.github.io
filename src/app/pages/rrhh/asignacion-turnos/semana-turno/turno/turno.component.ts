import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgStyle, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.scss'],
  standalone: true,
  imports: [FormsModule, NgStyle, NgFor],
})
export class TurnoComponent implements OnInit {
  @Input('turnos') turnos: Array<any>;
  @Output('changed') changed = new EventEmitter<any>();
  turno = 'seleccione';
  active = false;
  withColor = '#9da4ad';
  constructor() {}

  ngOnInit(): void {}

  changeColor(event) {
    if (this.turno === 'seleccione') {
      this.withColor = '#9da4ad';
      this.changed.emit(this.turno);
      return;
    }
    if (this.turno === '0') {
      this.changed.emit(this.turno);
      this.withColor = '#000';
      return;
    }

    let turn = this.turnos.find((turno) => {
      return turno.id == event;
    });
    this.withColor = turn.color;
    this.changed.emit(turn.id);
  }
}

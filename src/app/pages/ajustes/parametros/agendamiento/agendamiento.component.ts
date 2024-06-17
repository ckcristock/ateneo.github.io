import { Component, OnInit } from '@angular/core';
import { TiposAgendaComponent } from './components/tipos-agenda/tipos-agenda.component';
import { TiposConsultaComponent } from './components/tipos-consulta/tipos-consulta.component';

@Component({
  selector: 'app-agendamiento',
  templateUrl: './agendamiento.component.html',
  styleUrls: ['./agendamiento.component.scss'],
  standalone: true,
  imports: [TiposConsultaComponent, TiposAgendaComponent],
})
export class AgendamientoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

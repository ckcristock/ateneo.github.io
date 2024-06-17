import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { TablaRadicacionesComponent } from './tabla-radicaciones/tabla-radicaciones.component';
import { EstadisticasRadicacionesComponent } from './estadisticas-radicaciones/estadisticas-radicaciones.component';

@Component({
  selector: 'app-radicacion',
  templateUrl: './radicacion.component.html',
  styleUrls: ['./radicacion.component.css'],
  standalone: true,
  imports: [EstadisticasRadicacionesComponent, TablaRadicacionesComponent],
})
export class RadicacionComponent implements OnInit {
  @ViewChild('alertSwal') alertSwal: any;

  public updateEstadisticasSubject: Subject<any> = new Subject<any>();

  public DatosCabecera: any = {
    Titulo: 'Radicaciones',
    Fecha: new Date(),
    Codigo: '',
  };

  constructor() {}

  ngOnInit() {}

  MostrarMensajeHijo(msgObj: any) {
    this.ShowSwal(msgObj.type, msgObj.title, msgObj.msg);
  }

  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  UpdateEstadisticas() {
    this.updateEstadisticasSubject.next(null);
  }
}

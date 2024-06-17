import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class CitasComponent implements OnInit {
  data: any = {
    Id_Especialidad: '',
  };
  typesDocuments: Array<any> = [
    { Nombre: 'CI', Id: '1' },
    { Nombre: 'CC', Id: '2' },
    { Nombre: 'CC', Id: '2' },
  ];
  citas: any = [
    {
      Id_Cita: '1',
      Estado: 'Activa',
      Descripcion:
        'Cita trauma Cita trauma Cita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita trauma',
      Especialidad: 'Traumatólogo',
      Fecha: '2018-09-28 17:21:21',
    },
    {
      Id_Cita: '1',
      Estado: 'Activa',
      Descripcion:
        'Cita trauma Cita trauma Cita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita trauma',
      Especialidad: 'Traumatólogo',
      Fecha: '2018-09-28 17:21:21',
    },
    {
      Id_Cita: '1',
      Estado: 'Activa',
      Descripcion:
        'Cita trauma Cita trauma Cita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita trauma',
      Especialidad: 'Traumatólogo',
      Fecha: '2018-09-28 17:21:21',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}

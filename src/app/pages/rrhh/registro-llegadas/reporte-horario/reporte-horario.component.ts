import { Component, OnInit } from '@angular/core';
import { ReporteHorarioService } from './reporte-horario.service';

@Component({
  selector: 'app-reporte-horario',
  templateUrl: './reporte-horario.component.html',
  standalone: true,
  styleUrls: ['./reporte-horario.component.scss'],
})
export class ReporteHorarioComponent implements OnInit {
  companies: any;
  reportes: any = [
    {
      dependency: 'Bodega',
      funcionarios: [
        {
          id: 1,
          selected: true,
          name: 'Néstor Eduardo Lima Rojas',
          llegadas_tardes: '2 Llegadas Tarde',
          historial: [
            {
              fecha: 'Lunes, 4 de agosto de 2021',
              entrada1: '13:45:12',
              salida1: '32:45:78',
              entrada2: '45:78:02',
              salida2: '98:63:36',
            },
          ],
        },
        {
          id: 2,
          selected: true,
          name: ' Julio Alexander Lopez Martinez',
          llegadas_tardes: '7 LLegadas Tarde',
          historial: [
            {
              fecha: 'Martes, 4 de agosto de 2021',
              entrada1: '13:45:12',
              salida1: '32:45:78',
              entrada2: '45:78:02',
              salida2: '98:63:36',
            },
          ],
        },
      ],
    },
    {
      dependency: 'Compras',
      funcionarios: [
        {
          id: 3,
          selected: true,
          name: 'Carlos Andres Perez Ramirez',
          llegadas_tardes: '0 Llegadas Tarde',
          historial: [
            {
              fecha: 'Miercoles, 4 de agosto de 2021',
              entrada1: '13:45:12',
              salida1: '32:45:78',
              entrada2: '45:78:02',
              salida2: '98:63:36',
            },
          ],
        },
        {
          id: 4,
          selected: true,
          name: 'Manuel David Marques Flores',
          llegadas_tardes: '4 LLegadas Tarde',
          historial: [
            {
              fecha: 'Jueves, 4 de agosto de 2021',
              entrada1: '13:45:12',
              salida1: '32:45:78',
              entrada2: '45:78:02',
              salida2: '98:63:36',
            },
          ],
        },
      ],
    },
    {
      dependency: 'Contabilidad',
      funcionarios: [
        {
          id: 5,
          selected: true,
          name: 'Mario Eugenia Sandoval Gomez',
          llegadas_tardes: '0 Llegadas Tarde',
          historial: [
            {
              fecha: 'Viernes, 4 de agosto de 2021',
              entrada1: '13:45:12',
              salida1: '32:45:78',
              entrada2: '45:78:02',
              salida2: '98:63:36',
            },
          ],
        },
        {
          id: 6,
          selected: true,
          name: 'JHON FREDDY JOYA ECHEVERRIA',
          llegadas_tardes: '4 LLegadas Tarde',
          historial: [
            {
              fecha: 'Sabado, 4 de agosto de 2021',
              entrada1: '13:45:12',
              salida1: '32:45:78',
              entrada2: '45:78:02',
              salida2: '98:63:36',
            },
          ],
        },
        {
          id: 7,
          selected: true,
          name: 'PAULA ANDREA TARAZONA SANDOVAL',
          llegadas_tardes: '4 LLegadas Tarde',
          historial: [
            {
              fecha: 'Domingo, 4 de agosto de 2021',
              entrada1: '13:45:12',
              salida1: '32:45:78',
              entrada2: '45:78:02',
              salida2: '98:63:36',
            },
          ],
        },
      ],
    },
  ];

  constructor(private _rh: ReporteHorarioService) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies() {
    this._rh.getCompanies().subscribe((res: any) => {
      this.companies = res.data;
    });
  }
}

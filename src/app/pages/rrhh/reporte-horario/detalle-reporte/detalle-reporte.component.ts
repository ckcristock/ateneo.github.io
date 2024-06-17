import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { ImagePipe } from '../../../../core/pipes/image.pipe';
import { DetalleHorarioComponent } from '../detalle-horario/detalle-horario.component';
import { DetalleHorarioRotativoComponent } from '../detalle-horario-rotativo/detalle-horario-rotativo.component';
import { NgIf, NgFor, NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-detalle-reporte',
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    DetalleHorarioRotativoComponent,
    DetalleHorarioComponent,
    TitleCasePipe,
    ImagePipe,
  ],
})
export class DetalleReporteComponent implements OnInit {
  @Input('type') type: any[];
  @Input('reporteHorarios') reporteHorarios: any[];
  @Input('permissions') permissions: Permissions;
  @Output('update') update = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  showDetail() {}

  updateList() {
    this.update.emit();
  }
}

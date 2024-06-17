import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { consts } from 'src/app/core/utils/consts';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ReporteHorarioService } from '../reporte-horario.service';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/core/services/modal.service';
import { TimePipe } from '../../../../core/pipes/time.pipe';
import { InputPositionInitialDirective } from '../../../../core/directives/input-position-initial.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalle-horario-rotativo',
  templateUrl: './detalle-horario-rotativo.component.html',
  styleUrls: ['./detalle-horario-rotativo.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbPopover,
    FormsModule,
    NgxCurrencyDirective,
    InputPositionInitialDirective,
    DatePipe,
    TimePipe,
  ],
})
export class DetalleHorarioRotativoComponent implements OnInit {
  @Input('horarios') horarios: any;
  @Input('horas') horas: any;
  @Input('horasEditadas') horasEditadas: any;
  @Input('permissions') permissions: Permissions;
  @Output('update') updateList = new EventEmitter();
  mask = consts;
  horarioEditado: any[] = [];

  constructor(
    private _swal: SwalService,
    private _reporteHorarios: ReporteHorarioService,
    private _modal: ModalService,
  ) {}

  ngOnInit(): void {}

  openModal(content, element) {
    this._modal.open(content, 'lg');
    this.horarioEditado = element.edit;
  }

  convertHours(decimal) {
    let horas = Math.floor(decimal);
    let minutos = Math.round((decimal - horas) * 60);
    return `${horas}h ${minutos}m`;
  }

  update(item) {
    Swal.fire({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      html: `
      <textarea id="justification-input" class="swal2-textarea" required placeholder="Escribe la justificación..."></textarea>
    `,
      showCancelButton: true,
      confirmButtonColor: '#A3BD30',
      confirmButtonText: '¡Sí, confirmar!',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: () => {
        const justification = (document.getElementById('justification-input') as HTMLInputElement)
          .value;

        if (!justification) {
          Swal.showValidationMessage('La justificación es requerida');
          return false;
        }
        item.justification = justification;
        return this._reporteHorarios.updateHoursWorked(item).toPromise();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })
      .then((result) => {
        if (result.isConfirmed) {
          item.editHour = false;
          this.updateList.emit();
          this._swal.show({
            icon: 'success',
            title: 'Operación exitosa',
            showCancel: false,
            text: 'Horas totales editadas',
            timer: 1000,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      });
  }
}

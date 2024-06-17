import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../services/swal.service';
import { FixedTurnService } from './turno-fijo.service';
import { AutomaticSearchComponent } from '../../../../../shared/components/automatic-search/automatic-search.component';
import { ActionEditComponent } from '../../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { NgClass, UpperCasePipe } from '@angular/common';
import { TableComponent } from '../../../../../shared/components/standard-components/table/table.component';
import { RouterLink } from '@angular/router';
import { AddButtonComponent } from '../../../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';

@Component({
  selector: 'app-turno-fijo',
  templateUrl: './turno-fijo.component.html',
  styleUrls: ['./turno-fijo.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    RouterLink,
    TableComponent,
    NgClass,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    UpperCasePipe,
    StatusBadgeComponent,
  ],
})
export class TurnoFijoComponent implements OnInit {
  turnosFijos = [];
  hours: any = [];
  loading = false;
  loadingHours = false;
  pagination = {
    page: 1,
    pageSize: 20,
    length: 0,
  };
  filtro: any = {
    name: '',
  };

  constructor(
    private _turnFixed: FixedTurnService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getTurns();
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  private getDismissReason(reason: any) {}

  getTurns() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._turnFixed.getFixedTurns(params).subscribe((r: any) => {
      this.turnosFijos = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
  }

  findHours(fixed_turn_id) {
    this.loadingHours = true;
    this._turnFixed.getFixedTurnHours({ fixed_turn_id }).subscribe((r: any) => {
      this.hours = r.data;
      this.loadingHours = false;
    });
  }

  changeState(id) {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Asegúrate de haber movido los funcionarios a otro turno, si existen en el turno actual serán modificados',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._turnFixed.changeState(id).subscribe((r: any) => {
            let icon = 'success';
            let text = 'Turno actualizado correctamente';
            let title = 'Operación exitosa';
            if (r.code != 200) {
              icon = 'error';
              text = 'Comuníquese con el Dpt. de sistemas';
              title = 'Ha ocurrido un error';
            }
            this.getTurns();
            this._swal.show({ title, text, icon, showCancel: false, timer: 1000 });
          });
        }
      });
  }
}

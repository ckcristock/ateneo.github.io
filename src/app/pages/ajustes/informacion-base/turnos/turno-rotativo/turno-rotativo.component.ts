import { Component, EventEmitter, OnInit } from '@angular/core';
import { SwalService } from '../../services/swal.service';
import { RotatingTurnService } from './rotating-turn.service';
import { CreateTurnoRotativoComponent } from './create-turno-rotativo/create-turno-rotativo.component';
import { AutomaticSearchComponent } from '../../../../../shared/components/automatic-search/automatic-search.component';
import { ActionEditComponent } from '../../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { NgClass, UpperCasePipe, DatePipe } from '@angular/common';
import { TableComponent } from '../../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
@Component({
  selector: 'app-turno-rotativo',
  templateUrl: './turno-rotativo.component.html',
  styleUrls: ['./turno-rotativo.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    NgClass,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    CreateTurnoRotativoComponent,
    UpperCasePipe,
    DatePipe,
    StatusBadgeComponent,
  ],
})
export class TurnoRotativoComponent implements OnInit {
  pagination = {
    page: 1,
    pageSize: 20,
    length: 0,
  };
  filtro: any = {
    name: '',
  };
  showModal = new EventEmitter<any>();
  loading = false;
  turnosRotativo: any = [];
  constructor(
    private _rotatingT: RotatingTurnService,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  create(id = 0) {
    this.showModal.emit(id);
  }
  getAll() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._rotatingT.getAll(params).subscribe((r: any) => {
      this.loading = false;
      this.turnosRotativo = r.data.data;
      this.pagination.length = r.data.total;
    });
  }
  changeState(id) {
    this._swal
      .show({
        icon: 'warning',
        title: '¿Estás seguro(a)?',
        text: 'Asegúrate de haber movido los funcionarios a otro turno, si existen en el turno actual serán modificados',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._rotatingT.changeState(id).subscribe((r: any) => {
            let icon = 'success';
            let text = 'Turno actualizado correctamente';
            let title = 'Operación exitosa';
            if (r.code != 200) {
              icon = 'error';
              text = 'Comuníquese con el Dpt. de sistemas';
              title = 'Ha ocurrido un error';
            }
            this.getAll();
            this._swal.show({ title, text, icon, showCancel: false, timer: 1000 });
          });
        }
      });
  }
}

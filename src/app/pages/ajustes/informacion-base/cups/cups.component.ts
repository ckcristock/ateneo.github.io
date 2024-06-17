import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CupService } from './cup.service';
import { ModalCupComponent } from './modal-cup/modal-cup.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '../../../../shared/components/automatic-search/automatic-search.component';
import { ActionEditComponent } from '../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';

import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../../shared/components/standard-components/add-button/add-button.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-cups',
  templateUrl: './cups.component.html',
  styleUrls: ['./cups.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    ModalCupComponent,
  ],
})
export class CupsComponent implements OnInit {
  @ViewChild(ModalCupComponent) modal: ModalCupComponent;
  cups: any = [];
  cup: any = {};
  filtros: any = {
    description: '',
    code: '',
    type_service_id: '',
  };

  pagination = {
    pageSize: 25,
    page: 1,
    length: 0,
  };

  loading: boolean = false;

  constructor(
    private cupService: CupService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getAllCups();
    this.getTypes();
    this.getUrlFilters();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
  }

  openModal = () => {
    this.modal.openModal();
  };

  edit = (id) => {
    this.modal.cup.id = id;
    this.modal.openModal();
  };

  getAllCups() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this.cupService.getAllPaginateCup(params).subscribe((res: any) => {
      this.loading = false;
      this.cups = res.data.data;
      this.pagination.length = res.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  anularOActivar(zone, status) {
    let data: any = {
      id: zone.id,
      status,
    };

    Swal.fire({
      title: '¿Estas seguro?',
      text: status === 'Inactivo' ? 'La Cup se Inactivará!' : 'La Cup se activará',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cupService.createNewCup(data).subscribe((res) => {
          this.getAllCups();
          Swal.fire({
            title: status === 'Inactivo' ? 'Cup Inhabilitada!' : 'Cup activada',
            text:
              status === 'Inactivo'
                ? 'La Cup ha sido Inhabilitada con éxito.'
                : 'La Cup ha sido activada con éxito.',
            icon: 'success',
          });
        });
      }
    });
  }
  cups_type: any[] = [];
  getTypes() {
    this.cupService.getTypes().subscribe((resp: any) => {
      this.cups_type = resp.data;
    });
  }
}

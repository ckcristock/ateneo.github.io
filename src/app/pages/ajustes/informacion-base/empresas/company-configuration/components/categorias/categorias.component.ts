import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoriasService } from './categorias.service';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { SwalService } from '../../../../services/swal.service';
import { UpperCasePipe } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    AutomaticSearchComponent,
    FormsModule,
    MatSelectModule,
    StandardModule,
    AddButtonComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    ModalComponent,
    UpperCasePipe,
  ],
})
export class CategoriasComponent implements OnInit {
  @Output() requestReload = new EventEmitter<Event>();

  categorias = [];
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  filters = {
    nombre: '',
    compraInternacional: '',
  };
  currentCompany: any;

  loading = true;

  constructor(
    private _categorias: CategoriasService,
    private ModalService: NgbModal,
    private _swal: SwalService,
    public rutaActiva: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.currentCompany = this.rutaActiva.snapshot.params.id;
    this.getCategories();
  }

  getCategories() {
    this.loading = true;
    let param: any = { ...this.pagination, ...this.filters };
    param ? (param.company_id = parseInt(this.currentCompany)) : '';
    this._categorias.paginacionCategorias(param).subscribe((res: any) => {
      this.categorias = res.data.data;
      this.pagination.length = res.data.total;
      this.loading = false;
    });
  }

  openManageCategory(data?: any) {
    const modalRef = this.ModalService.open(ManageCategoryComponent, { size: 'lg' });
    modalRef.componentInstance.data = { ...data };
    modalRef.componentInstance.currentCompany = this.currentCompany;
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'success') this.getCategories();
      },
    });
  }

  inOff(id, state, event: Event) {
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text:
          '¡Esta categoría y las subcategorías asociadas a ella se ' +
          (state == 0 ? 'anularán!' : 'reactivarán!'),
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._categorias.changeActive(id, { activo: state }).subscribe((res: any) => {
            this.requestReload.emit(event);
            this.getCategories();
            this._swal.show({
              icon: 'success',
              title: '¡Operación exitosa!',
              text: res.data,
              timer: 1000,
              showCancel: false,
            });
          });
        }
      });
  }
}

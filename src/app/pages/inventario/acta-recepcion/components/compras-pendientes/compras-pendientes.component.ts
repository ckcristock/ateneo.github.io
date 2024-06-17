import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { RouterModule } from '@angular/router';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { ActaRecepcionService } from '../../acta-recepcion.service';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NonconformingComponent } from './nonconforming/nonconforming.component';

@Component({
  selector: 'app-compras-pendientes',
  standalone: true,
  imports: [
    CardComponent,
    TableComponent,
    RouterModule,
    DatePipe,
    TitleCasePipe,
    DecimalPipe,
    DropdownActionsComponent,
    HeaderButtonComponent,
    ActionViewComponent,
    ActionButtonComponent,
    ActionEditComponent,
    AutomaticSearchComponent,
  ],
  templateUrl: './compras-pendientes.component.html',
  styleUrl: './compras-pendientes.component.scss',
})
export class ComprasPendientesComponent implements OnInit {
  @Input() companyWorkedId!: any;
  pendientesNacional = [];
  loadingComprasPendientes: boolean = false;
  filtersCP = {
    codigo: '',
    proveedor: '',
  };

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  constructor(
    private actaRecepcionService: ActaRecepcionService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getComprasPendientes();
  }

  openNonconforming() {
    this.modalService.open(NonconformingComponent);
  }

  getComprasPendientes(compra = 'Nacional') {
    this.loadingComprasPendientes = true;
    let params = {
      ...this.pagination,
      compra: compra,
      company_id: this.companyWorkedId,
      ...this.filtersCP,
    };
    this.actaRecepcionService.getComprasPendientes(params).subscribe((res: any) => {
      this.pendientesNacional = res.data.data;
      this.pagination.length = res.data.total;
      this.loadingComprasPendientes = false;
    });
  }
}

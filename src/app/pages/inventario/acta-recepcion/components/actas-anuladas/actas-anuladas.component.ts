import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ActaRecepcionService } from '../../acta-recepcion.service';
import { RouterModule } from '@angular/router';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';

@Component({
  selector: 'app-actas-anuladas',
  standalone: true,
  imports: [
    CardComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionViewComponent,
    RouterModule,
    DatePipe,
    AutomaticSearchComponent,
  ],
  templateUrl: './actas-anuladas.component.html',
  styleUrl: './actas-anuladas.component.scss',
})
export class ActasAnuladasComponent implements OnInit {
  @Input() companyWorkedId!: any;
  public ActasAnuladas: any = [];
  public loadindAA: boolean = false;
  public Filtros: any = {
    codigo_acta: '',
  };
  pagination1 = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  constructor(private actaRecepciónService: ActaRecepcionService) {}

  ngOnInit(): void {
    this.getActasAnuladas();
  }

  getActasAnuladas() {
    this.loadindAA = true;
    let params = {
      ...this.SetFiltros(),
      company_id: this.companyWorkedId,
    };
    this.actaRecepciónService.getActasAnuladas(params).subscribe((res: any) => {
      if (res.status) {
        this.ActasAnuladas = res.data.data;
        this.pagination1.length = res.data.total;
        this.loadindAA = false;
      } else {
        this.ActasAnuladas = [];
        this.loadindAA = false;
      }
    });
  }

  SetFiltros() {
    let params: any = {};
    params.tam = this.pagination1.pageSize;
    params.pag = this.pagination1.page;
    if (this.Filtros.codigo_acta != '') {
      params.codigo = this.Filtros.codigo_acta;
    }
    return params;
  }
}

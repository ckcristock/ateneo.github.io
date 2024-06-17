import { Component, OnInit } from '@angular/core';
import { HistorialDatosService } from './historial-datos.service';
import { variables } from './variables';
import { ActivatedRoute } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-historial-datos',
  templateUrl: './historial-datos.component.html',
  styleUrls: ['./historial-datos.component.scss'],
  standalone: true,
  imports: [NgbPagination, NotDataComponent, DatePipe, CardComponent, TableComponent],
})
export class HistorialDatosComponent implements OnInit {
  historialdatos: any[] = [];
  loading: boolean;
  pagination = {
    pageSize: 10,
    page: 1,
    length: 0,
  };
  currentCompany: any;

  constructor(
    private _historialdatos: HistorialDatosService,
    public rutaActiva: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentCompany = this.rutaActiva.snapshot.params.id;
    this.getHistoryDataCompany();
  }

  getHistoryDataCompany() {
    this.loading = true;
    let params = { ...this.pagination, company_id: this.currentCompany };
    this._historialdatos.getHistoryDataCompany(params).subscribe((res: any) => {
      this.loading = false;
      this.historialdatos = res.data.data;
      this.historialdatos.forEach((history) => {
        let item = variables.find((x) => x.campo == history.data_name);
        history.data_name_for_user = item?.nombre;
      });
      this.pagination.length = res.data.total;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { TiposConsultaService } from './tipos-consulta.service';
import { TableComponent } from '../../../../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-tipos-consulta',
  templateUrl: './tipos-consulta.component.html',
  styleUrls: ['./tipos-consulta.component.scss'],
  standalone: true,
  imports: [CardComponent, TableComponent],
})
export class TiposConsultaComponent implements OnInit {
  loading: boolean = false;
  tiposConsulta: any[] = [];
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  constructor(private _tipoService: TiposConsultaService) {}

  ngOnInit(): void {
    this.getTiposConsulta();
  }

  getTiposConsulta() {
    this.loading = true;
    this._tipoService.paginate(this.pagination).subscribe((res: any) => {
      this.loading = false;
      this.tiposConsulta = res.data.data;
      this.pagination.length = res.data.total;
    });
  }
}

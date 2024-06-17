import { Component, OnInit } from '@angular/core';
import { TiposAgendaService } from './tipos-agenda.service';
import { TableComponent } from '../../../../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-tipos-agenda',
  templateUrl: './tipos-agenda.component.html',
  styleUrls: ['./tipos-agenda.component.scss'],
  standalone: true,
  imports: [CardComponent, TableComponent],
})
export class TiposAgendaComponent implements OnInit {
  loading: boolean = false;
  tiposAgenda: any[] = [];
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  constructor(private _tipoService: TiposAgendaService) {}

  ngOnInit(): void {
    this.getTiposAgenda();
  }

  getTiposAgenda(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._tipoService.paginate(this.pagination).subscribe((res: any) => {
      this.loading = false;
      this.tiposAgenda = res.data.data;
      this.pagination.length = res.data.total;
    });
  }
}

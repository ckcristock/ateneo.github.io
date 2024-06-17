import { Component, OnInit, EventEmitter, Input, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { ListaTrabajoService } from '../lista-trabajo.service';

@Component({
  selector: 'app-detail-stats',
  templateUrl: './detail-stats.component.html',
  styleUrls: ['./detail-stats.component.scss'],
  standalone: true,
  imports: [ModalComponent, TableComponent],
})
export class DetailStatsComponent implements OnInit {
  @Input('showDeitalStat') showDeitalStat: EventEmitter<any>;
  @ViewChild('detail') detail: any;
  data: any[];
  loading = false;
  constructor(
    private _workList: ListaTrabajoService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.showDeitalStat.subscribe((d) => {
      this.loading = true;
      this.modalService.open(this.detail);

      this._workList.getStatisticsDetail(d).subscribe((r: any) => {
        this.loading = false;
        this.data = r.data;
      });
    });
  }
}

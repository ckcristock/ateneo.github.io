import { Component, OnInit } from '@angular/core';
import { UpperCasePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { CesantiasService } from '../cesantias.service';
import { LoadImageComponent } from '../../../../shared/components/load-image/load-image.component';

@Component({
  selector: 'app-cesantias-ver',
  templateUrl: './cesantias-ver.component.html',
  styleUrls: ['./cesantias-ver.component.scss'],
  standalone: true,
  imports: [
    LoadImageComponent,
    NotDataComponent,
    UpperCasePipe,
    DecimalPipe,
    CardComponent,
    TableComponent,
  ],
})
export class CesantiasVerComponent implements OnInit {
  params: any = {};
  severanceService$: any;
  loading: boolean;
  data: any = {};
  constructor(
    private route: ActivatedRoute,
    private _cesantias: CesantiasService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.params.type = params.type;
      this.params.id = params.id;
      this.getSeverance();
    });
  }

  getSeverance() {
    this.loading = true;
    if (this.params.type == 'intereses') {
      this.severanceService$ = this._cesantias.getSeveranceInterest(this.params.id);
    } else if (this.params.type == 'pago') {
      this.severanceService$ = this._cesantias.getSeverance(this.params.id);
    }
    this.severanceService$.subscribe((res: any) => {
      this.data = res.data;
      this.loading = false;
    });
  }
}

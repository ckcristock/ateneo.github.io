import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { TercerosService } from '../terceros.service';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe, LowerCasePipe, DecimalPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-view-third',
  templateUrl: './view-third.component.html',
  styleUrls: ['./view-third.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatPaginatorModule,
    NotDataComponent,
    UpperCasePipe,
    LowerCasePipe,
    DecimalPipe,
    TitleCasePipe,
    CapitalLetterPipe,
  ],
})
export class ViewThirdComponent implements OnInit {
  paginacionPeople: any;
  third_id;
  third_data;
  people: any[] = [];
  third_party_fields: any[] = [];
  loading: boolean;
  pagination: any = {
    pagePeople: 1,
    pageSizePeople: 10,
    collectionSizePeople: 0,
  };

  constructor(
    private _tercero: TercerosService,
    private route: ActivatedRoute,
    private _modal: ModalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.third_id = params.get('id');
      this.getThird();
    });
  }

  openModal(content) {
    this._modal.open(content);
  }
  getThird(page = 1) {
    this.loading = true;
    this._tercero.showThirdParty(this.third_id, this.pagination).subscribe((res: any) => {
      this.third_data = res.data.third_party_query;
      this.people = res.data.people.data;
      this.third_party_fields = res.data.third_party_fields;
      this.pagination.collectionSizePeople = res.data.people.total;
      this.paginacionPeople = res.data.people;
      this.loading = false;
    });
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pagePeople = event.pageIndex + 1;
    this.getThird();
  }
}

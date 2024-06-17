import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { RegimenesNivelesService } from './regimenes-niveles.service';
import { NgClass, LowerCasePipe, DecimalPipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-regimenes-niveles',
  templateUrl: './regimenes-niveles.component.html',
  styleUrls: ['./regimenes-niveles.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    NgClass,
    NotDataComponent,
    AutomaticSearchComponent,
    LowerCasePipe,
    DecimalPipe,
  ],
})
export class RegimenesNivelesComponent implements OnInit {
  dataFormRegime: any;
  dataFormLevel: any;

  regimes = [];
  levels = [];

  public loadingRegimes = false;
  public loadingLevels = false;
  public filtrosRegimes = {
    name: '',
    code: '',
  };
  public filtrosLevels = {
    name: '',
    code: '',
    cuote: '',
  };
  public pagination = {
    regimes: {
      page: 1,
      pageSize: 5,
      length: 0,
    },
    levels: {
      page: 1,
      pageSize: 5,
      length: 0,
    },
  };
  public regimeSelected: any = {
    id: null,
    nombre: '',
  };

  constructor(private _regimesLevels: RegimenesNivelesService) {}

  ngOnInit(): void {
    this.getRegimes();
  }

  getRegimes() {
    let params = {
      ...this.pagination.regimes,
      ...this.filtrosRegimes,
    };
    this.loadingRegimes = true;
    this._regimesLevels.getRegimes(params).subscribe((res: any) => {
      this.regimes = res.data.data;
      this.loadingRegimes = false;
      this.pagination.regimes.length = res.data.total;
    });
  }

  selected(model, value) {
    model = model.map((m) => {
      m.selected = m.id == value ? true : false;
    });
  }

  getLevels(regime) {
    let params = {
      ...this.pagination.levels,
      ...this.filtrosLevels,
    };
    this.loadingLevels = true;
    this._regimesLevels.getLevelsRegime(regime, params).subscribe((res: any) => {
      this.levels = res.data.data;
      this.loadingLevels = false;
      this.pagination.levels.length = res.data.total;
    });
  }
}

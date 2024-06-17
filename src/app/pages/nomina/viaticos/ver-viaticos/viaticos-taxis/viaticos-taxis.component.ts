import { Component, OnInit, Input, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { helperLegalizar } from '../../legalizar/helpers-legalizar';
import { LegalizarDataService } from '../../legalizar/legalizar-data.service';
import { Subscription } from 'rxjs';
import { consts } from 'src/app/core/utils/consts';
import { InputPositionDirective } from '../../../../../core/directives/input-position.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-viaticos-taxis',
  templateUrl: './viaticos-taxis.component.html',
  styleUrls: ['./viaticos-taxis.component.scss'],
  standalone: true,
  imports: [FormsModule, NgxCurrencyDirective, InputPositionDirective, DecimalPipe, TableComponent],
})
export class ViaticosTaxisComponent implements OnInit {
  @Input('legal') legal = false;
  @ViewChildren('file', { read: ElementRef }) file: QueryList<ElementRef>;
  taxi: any[] = [];
  masks = consts;
  viaticos$: Subscription;
  data: any;

  constructor(private _viaticosData: LegalizarDataService) {}

  ngOnInit(): void {
    this.viaticos$ = this._viaticosData.viaticos.subscribe((r: any) => {
      this.data = r;
      this.taxi = r.expense_taxi_cities;
    });
  }

  onFileChanged(event, i: number, model) {
    let myFile = this.file.toArray()[i];
    helperLegalizar.getImage(event, myFile, model);
  }
  ngOnDestroy(): void {
    this.viaticos$.unsubscribe();
  }
}

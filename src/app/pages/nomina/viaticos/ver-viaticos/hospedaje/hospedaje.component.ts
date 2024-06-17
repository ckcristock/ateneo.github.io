import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { LegalizarDataService } from '../../legalizar/legalizar-data.service';
import { Subscription } from 'rxjs';
import { consts } from '../../../../../core/utils/consts';
import { helperLegalizar } from '../../legalizar/helpers-legalizar';
import { InputPositionDirective } from '../../../../../core/directives/input-position.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, UpperCasePipe, DecimalPipe } from '@angular/common';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-hospedaje',
  templateUrl: './hospedaje.component.html',
  styleUrls: ['./hospedaje.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    NgxCurrencyDirective,
    InputPositionDirective,
    UpperCasePipe,
    DecimalPipe,
    TableComponent,
  ],
})
export class HospedajeComponent implements OnInit, OnDestroy {
  @ViewChildren('file', { read: ElementRef }) file: QueryList<ElementRef>;
  @Input('legal') legal = false;
  data: any = [];
  hotels: any[];
  masks = consts;
  viaticos$: Subscription;
  constructor(private _viaticosData: LegalizarDataService) {}

  ngOnInit(): void {
    this.viaticos$ = this._viaticosData.viaticos.subscribe((r: any) => {
      this.data = r;
      this.hotels = r.hotels;
    });
  }

  ngOnDestroy(): void {
    this.viaticos$.unsubscribe();
  }
  onFileChanged(event, i: number, model) {
    let myFile = this.file.toArray()[i];
    helperLegalizar.getImage(event, myFile, model);
  }
}

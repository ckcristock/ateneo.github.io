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
import { helperLegalizar } from '../../legalizar/helpers-legalizar';
import { consts } from 'src/app/core/utils/consts';
import { InputPositionDirective } from '../../../../../core/directives/input-position.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transporte-terrestre',
  templateUrl: './transporte-terrestre.component.html',
  styleUrls: ['./transporte-terrestre.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NgxCurrencyDirective, InputPositionDirective, DecimalPipe],
})
export class TransporteTerrestreComponent implements OnInit, OnDestroy {
  @Input() type: 'air' | 'ground' = 'ground';

  @Input() transports: any[];

  @Input('legal') legal = false;
  @ViewChildren('file', { read: ElementRef }) file: QueryList<ElementRef>;
  viaticos$: Subscription;
  data: any;
  masks = consts;

  constructor(private _viaticosData: LegalizarDataService) {}

  ngOnInit(): void {
    if (this.type === 'ground') this.getGroundTransport();
  }

  private getGroundTransport(): void {
    this.viaticos$ = this._viaticosData.viaticos.subscribe((r: any) => {
      this.data = r;
      this.transports = r.transports;
    });
  }

  onFileChanged(event, i: number, model) {
    let myFile = this.file.toArray()[i];
    helperLegalizar.getImage(event, myFile, model);
  }
  ngOnDestroy(): void {
    if (this.viaticos$) this.viaticos$.unsubscribe();
  }
}

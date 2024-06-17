import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { LegalizarDataService } from './legalizar-data.service';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { PlaceholderFormComponent } from '@app/components/placeholder-form/placeholder-form.component';
import { VerViaticosService } from '../ver-viaticos/ver-viaticos.service';

@Component({
  selector: 'app-legalizar',
  templateUrl: './legalizar.component.html',
  standalone: true,
  imports: [CardComponent, PlaceholderFormComponent],
  styleUrls: ['./legalizar.component.scss'],
})
export class LegalizarComponent implements OnInit, OnDestroy {
  loading = false;
  data: any = {};
  id: string;
  viaticos$: Subscription;

  constructor(
    private _viaticos: VerViaticosService,
    private location: Location,
    private route: ActivatedRoute,
    private _viaticosData: LegalizarDataService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.viaticos$ = this._viaticosData.viaticos.subscribe((r) => {
      this.data = r;
    });

    this.getViatico();
  }

  getViatico() {
    this.loading = true;
    this._viaticos.getAllViaticos(this.id).subscribe((r: any) => {
      this.loading = false;
      this._viaticosData.viaticos.next(r.data);
    });
  }

  regresar() {
    this.location.back();
  }

  get validHotel() {
    if (this.data?.hotels?.length) {
      return !this.data.hotels.some(
        (hotel) => this.valid(hotel.reported) || this.valid(hotel.file),
      );
    }
    return true;
  }
  get validTransport() {
    if (this.data?.transports?.length) {
      return !this.data.transports.some(
        (transport) => this.valid(transport.reported) || this.valid(transport.file),
      );
    }
    return true;
  }
  get validTaxi() {
    if (this.data?.transports?.length) {
      return !this.data.expense_taxi_cities.some(
        (taxi) => this.valid(taxi.reported) || this.valid(taxi.file),
      );
    }
    return true;
  }

  ngOnDestroy(): void {
    this.viaticos$.unsubscribe();
  }

  valid(variable) {
    return variable === undefined || variable === null || variable === '';
  }
}

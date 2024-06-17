import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { CesantiasService } from '../cesantias.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { DecimalPipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';

@Component({
  selector: 'app-cesantia-current',
  templateUrl: './cesantia-current.component.html',
  styleUrls: ['./cesantia-current.component.scss'],
  standalone: true,
  imports: [DecimalPipe, NotDataComponent, CardComponent, TableComponent, LoadImageComponent],
})
export class CesantiaCurrentComponent implements OnInit {
  type: any;
  year: any;
  total_severance: any = 0;
  total_severance_interest: any = 0;
  loading: boolean = false;
  loadingValid: boolean = false;
  payValid: boolean = false;
  severanceList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _cesantias: CesantiasService,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.type = params.type;
      this.year = params.year;
      this.validate();
    });
  }

  validate() {
    this.loadingValid = true;
    let params = {
      year: this.year,
      type: this.type,
    };
    this._cesantias.validateYear(params).subscribe((res: any) => {
      this.loadingValid = false;
      if (!res.data) {
        this.payValid = true;
        this.getSeverancePayments();
      } else {
        this.payValid = false;
      }
    });
  }

  getSeverancePayments() {
    this.loading = true;
    this._cesantias.getSeverancePayments().subscribe((res: any) => {
      this.severanceList = res.data;
      res.data.forEach((item) => {
        this.total_severance += item.total_cesantias.total_severance;
        this.total_severance_interest += item.total_cesantias.total_severance_interest;
      });
      this.loading = false;
    });
  }

  pay() {
    const request = () => {
      let data = {
        type: this.type,
        year: this.year,
        people: this.severanceList,
        total_severance: this.total_severance,
        total_severance_interest: this.total_severance_interest,
      };
      this._cesantias.pay(data).subscribe((res: any) => {
        if (res.err) {
          this._swal.show({
            icon: 'error',
            title: 'ERROR',
            text: 'Intenta nuevamente',
            showCancel: false,
          });
        } else {
          this._swal.show({
            icon: 'success',
            title: res.data,
            text: '',
            showCancel: false,
            timer: 1000,
          });
          this.router.navigateByUrl('nomina/cesantias');
        }
      });
    };
    this._swal.swalLoading(
      this.type == 'pago'
        ? 'Vamos a pagar las cesantías.'
        : 'Vamos a pagar los intereses de las cesantías.',
      request,
    );
  }
}

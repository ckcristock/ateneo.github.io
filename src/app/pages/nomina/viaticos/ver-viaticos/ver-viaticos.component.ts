import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VerViaticosService } from './ver-viaticos.service';
import { Subscription } from 'rxjs';
import { LegalizarDataService } from '../legalizar/legalizar-data.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { UserService } from 'src/app/core/services/user.service';
import { PlaceholderFormComponent } from '../../../../components/placeholder-form/placeholder-form.component';
import { ViaticosTotalesComponent } from './viaticos-totales/viaticos-totales.component';
import { ViaticosAlimentacionComponent } from './viaticos-alimentacion/viaticos-alimentacion.component';
import { ViaticosTaxisComponent } from './viaticos-taxis/viaticos-taxis.component';
import { TransporteTerrestreComponent } from './transporte-terrestre/transporte-terrestre.component';
import { HospedajeComponent } from './hospedaje/hospedaje.component';
import { ViaticosViajeComponent } from './viaticos-viaje/viaticos-viaje.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { HeaderDownloadComponent } from '@shared/components/standard-components/header-download/header-download.component';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';

@Component({
  selector: 'app-ver-viaticos',
  templateUrl: './ver-viaticos.component.html',
  styleUrls: ['./ver-viaticos.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    ViaticosViajeComponent,
    HospedajeComponent,
    TransporteTerrestreComponent,
    ViaticosTaxisComponent,
    ViaticosAlimentacionComponent,
    ViaticosTotalesComponent,
    PlaceholderFormComponent,
    CardComponent,
    HeaderDownloadComponent,
    HeaderButtonComponent,
  ],
})
export class VerViaticosComponent implements OnInit {
  data: any;
  id: string;
  loading: boolean;
  viaticos$: Subscription;

  downloading = false;

  constructor(
    private _viaticos: VerViaticosService,
    private location: Location,
    private route: ActivatedRoute,
    private _viaticosData: LegalizarDataService,
    private _swal: SwalService,
    private readonly _userService: UserService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.viaticos$ = this._viaticosData.viaticos.subscribe((r) => {
      if (r) {
        this.data = r;
      }
    });

    this.getViatico();
  }

  getViatico() {
    this.loading = true;
    this._viaticos.getAllViaticos(this.id).subscribe((r: any) => {
      this._viaticosData.viaticos.next(r.data);
      this.loading = false;
    });
  }
  regresar() {
    this.location.back();
  }
  download() {
    this.downloading = true;
    let company_id = this._userService.user.person.company_worked.id;
    const { id } = this._userService.user.person.company_worked;
    this._viaticos.download(this.id, company_id).subscribe(
      (response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/pdf' });
        let link = document.createElement('a');
        const filename = 'viatico_' + this.id + '.pdf';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        this.downloading = false;
        /*  this.loading = false; */
      },
      (error) => {
        /*  this.loading = false; */
        this.downloading = false;
        this._swal.hardError();
      },
      () => {
        /*  this.loading = false; */
      },
    );
  }

  ngOnDestroy(): void {
    if (this.viaticos$) {
      this.viaticos$.unsubscribe();
    }
  }
}

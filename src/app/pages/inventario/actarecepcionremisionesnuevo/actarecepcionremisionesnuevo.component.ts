import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  TemplateRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, map, elementAt } from 'rxjs/operators';
import { FormControl, FormGroup, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Location, NgIf, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionButtonComponent } from '../../../shared/components/standard-components/action-button/action-button.component';
import { ActionViewComponent } from '../../../shared/components/standard-components/action-view/action-view.component';
import { LoadImageComponent } from '../../../shared/components/load-image/load-image.component';
import { AutomaticSearchComponent } from '../../../shared/components/automatic-search/automatic-search.component';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { downloadFile } from '@shared/functions/download-pdf.function';

@Component({
  selector: 'app-actarecepcionremisionesnuevo',
  templateUrl: './actarecepcionremisionesnuevo.component.html',
  styleUrls: ['./actarecepcionremisionesnuevo.component.scss'],
  standalone: true,
  imports: [
    AutomaticSearchComponent,
    LoadImageComponent,
    NgIf,
    RouterLink,
    ActionViewComponent,
    ActionButtonComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    DatePipe,
    StandardModule,
  ],
})
export class ActarecepcionremisionesnuevoComponent implements OnInit {
  rowsFilter1 = [];
  tempFilter1 = [];
  columns1 = [];
  public punto_activo: any;
  public ListaRemisones: any[] = [];
  public actarecepciones: any = [];

  public filtro_cod: string = '';
  public Identificacion: any;
  public Codigo: any = '';
  public Cargando = false;
  @ViewChild('PlantillaBotones1') PlantillaBotones1: TemplateRef<any>;
  filtro_fecha: any = '';
  public filtro_cod_r: string = '';

  globales = environment;

  downloading = -1;

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  loadingReferrals = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private location: Location,
  ) {
    this.punto_activo = localStorage.getItem('Punto');
    this.http
      .get(this.globales.base_url + '/php/actarecepcion/lista_actarecepcion_remisiones.php', {
        params: { id: '1' },
      })
      .subscribe((res: any) => {
        this.actarecepciones = res.data.data;
        this.pagination.length = res.data.total;
        this.loadingReferrals = false;
      });
    this.Identificacion = JSON.parse(localStorage.getItem('User'));
    this.punto_activo = localStorage.getItem('Punto');
  }

  ngOnInit() {
    this.Identificacion = JSON.parse(localStorage.getItem('User'));
    this.punto_activo = localStorage.getItem('Punto');
  }

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.filtro_fecha = `${formatDate(this.range.value.start as string)} - ${formatDate(
      this.range.value.end as string,
    )}`;
    this.filtros();
  }

  ListarRemisionesPendientes() {
    this.Cargando = true;
    this.http
      .get(this.globales.base_url + '/php/bodega/lista_remisiones_pendientes.php', {
        params: { cod: this.Codigo },
      })
      .subscribe((data: any) => {
        this.Cargando = false;
        this.ListaRemisones = data.data;
      });
  }

  paginacion() {
    let params: any = {
      page: this.pagination.page,
    };
    this.loadingReferrals = true;

    if (this.filtro_fecha != '' && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha.formatted;
      params.cod = this.filtro_cod;
    }
    if (this.filtro_cod_r != '') {
      params.codr = this.filtro_cod;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.http
      .get(
        this.globales.base_url +
          '/php/actarecepcion/lista_actarecepcion_remisiones.php?' +
          queryString,
      )
      .subscribe((res: any) => {
        this.actarecepciones = res.data.data;
        this.pagination.length = res.data.total;
        this.loadingReferrals = false;
      });
  }

  filtro() {
    this.loadingReferrals = true;
    let params: any = {
      page: this.pagination.page,
    };

    if (this.filtro_cod != '') {
      params.cod = this.filtro_cod;
    }
    if (this.filtro_cod_r != '') {
      params.codr = this.filtro_cod_r;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    setTimeout(() => {
      this.http
        .get(
          this.globales.base_url +
            '/php/actarecepcion/lista_actarecepcion_remisiones.php?' +
            queryString,
        )
        .subscribe((res: any) => {
          this.actarecepciones = res.data.data;
          this.pagination.length = res.data.total;
          this.loadingReferrals = false;
        });
    }, 500);
  }
  dateRangeChanged(event) {
    if (event.formatted != '') {
    }
    this.filtros();
  }
  filtros() {
    let params: any = {};
    this.loadingReferrals = true;

    if (this.filtro_cod != '' || this.filtro_fecha != '' || this.filtro_cod_r != '') {
      params.page = this.pagination.page;

      if (this.filtro_cod != '') {
        params.cod = this.filtro_cod;
      }
      if (this.filtro_fecha != '' && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha;
      }
      if (this.filtro_cod_r != '') {
        params.codr = this.filtro_cod_r;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
      this.location.replaceState('/inventario/acta-recepcion-remisiones', queryString);

      this.http
        .get(
          this.globales.base_url +
            '/php/actarecepcion/lista_actarecepcion_remisiones.php?' +
            queryString,
        )
        .subscribe((res: any) => {
          this.actarecepciones = res.data.data;
          this.pagination.length = res.data.total;
          this.loadingReferrals = false;
        });
    } else {
      this.location.replaceState('/inventario/acta-recepcion-remisiones', '');
      this.filtro_cod = '';
      this.filtro_fecha = '';

      this.http
        .get(this.globales.base_url + '/php/actarecepcion/lista_actarecepcion_remisiones.php')
        .subscribe((res: any) => {
          this.actarecepciones = res.data.data;
          this.pagination.length = res.data.total;
          this.loadingReferrals = false;
        });
    }
  }

  onFileDownload(index: number, id: number) {
    this.downloading = index;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .get(
        `${environment.base_url}/php/actarecepcion/descarga_pdf_acta_remision.php?tipo=Acta_Recepcion_Remision&id=${id}`,
        {
          responseType: 'blob' as 'json',
          headers,
        },
      )
      .subscribe({
        next: (file: any) => {
          this.downloading = -1;
          downloadFile({ name: 'acta-recepcion-remision', file });
        },
      });
  }
}

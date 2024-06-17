import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { Globales } from '../shared/globales/globales';

// import { Http, ResponseContentType } from '@angular/http';
import { User } from 'src/app/core/models/users.model';
import { UserService } from 'src/app/core/services/user.service';
import { ImagePipe } from '../../../../core/pipes/image.pipe';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { NotDataSaComponent } from '@app/components/not-data-sa/not-data-sa.component';
import { downloadFile } from '@shared/functions/download-pdf.function';

@Component({
  selector: 'app-remision',
  templateUrl: './remision.component.html',
  styleUrls: ['./remision.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DatePipe, ImagePipe, CabeceraComponent, NotDataSaComponent],
})
export class RemisionComponent implements OnInit {
  public remision: any = {};

  public userF: User;
  public productos: any[] = [];
  public env: any;
  public origen: any = [];
  public destino: any = [];
  public Actividades: any[] = [];
  public fecha = new Date();
  public id: any;
  public reducer = (accumulator, currentValue) =>
    accumulator + parseInt(currentValue.Cantidad_Formulada);
  public reducer2 = (accumulator, currentValue) =>
    accumulator + parseInt(currentValue.Cantidad_Entregada);
  public cant_formulada = 0;
  public cant_entregada = 0;
  public cant_diferencia = 0;
  DatosCabecera: any = {
    Titulo: 'Ver remisión',
    Fecha: new Date(),
    Codigo: '',
  };
  loading = true;

  downloading = {
    print: false,
    printPrice: false,
  };

  loadingHistory = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _user: UserService,
  ) {
    this.env = environment;
  }

  ngOnInit() {
    this.userF = this._user.user;
    this.id = this.route.snapshot.params['id'];
    this.http
      .get(environment.base_url + '/php/remision/remision.php', {
        params: { id: this.id },
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.remision = data.Remision;
        this.DatosCabecera.Codigo = this.remision.Codigo;
        this.origen = data.Origen;
        this.destino = data.Destino;
        this.loading = false;
      });
    this.http
      .get(environment.base_url + '/php/remision/productos_remision.php', {
        params: { id: this.id },
      })
      .subscribe((res: any) => {
        this.productos = res.data;
      });
    this.http
      .get(environment.base_url + '/php/remision/actividades_remision.php', {
        params: { id: this.id },
      })
      .subscribe((res: any) => {
        this.loadingHistory = false;
        this.Actividades = res.data;
      });
  }
  action(act) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = {
      tipo: 'Remision',
      id: this.id,
    };
    if (act === 'imprimir') this.downloading.print = true;
    if (act === 'imprimirconprecio') this.downloading.printPrice = true;
    this.http
      .get(
        `${environment.base_url}/php/archivos/${
          act === 'imprimir' ? 'descarga_pdf.php' : 'descarga_pdf_price.php'
        }`,
        {
          responseType: 'blob' as 'json',
          headers,
          params,
        },
      )
      .subscribe({
        next: (file: any) => {
          downloadFile({ name: 'remision', file });
          if (act === 'imprimir') this.downloading.print = false;
          if (act === 'imprimirconprecio') this.downloading.printPrice = false;
        },
      });
  }
}

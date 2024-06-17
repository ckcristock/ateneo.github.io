import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgStyle, NgFor } from '@angular/common';
import { downloadFile } from '@shared/functions/download-pdf.function';
import { NotDataSaComponent } from '@app/components/not-data-sa/not-data-sa.component';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';

@Component({
  selector: 'app-actarecepcionremisionver',
  templateUrl: './actarecepcionremisionver.component.html',
  styleUrls: ['./actarecepcionremisionver.component.scss'],
  standalone: true,
  imports: [NgStyle, NgFor, NotDataSaComponent, CabeceraComponent],
})
export class ActarecepcionremisionverComponent implements OnInit {
  public id = this.route.snapshot.params['id'];
  public Fecha = new Date();
  public Datos: any = {};
  public Productos: any[] = [];
  public Pendientes = 'none';
  headerData: any = {
    Titulo: 'Ver acta de recepción de remisiones',
    Fecha: new Date(),
    Codigo: '',
  };

  globales = environment;

  loading = true;

  downloading = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.http
      .get(this.globales.base_url + '/php/bodega/detalle_acta_recepcion_remision.php', {
        params: { id: this.id },
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.Datos = data.Datos;
        this.headerData.Codigo = this.Datos.Codigo_Remision;
        this.QuitarCampos();
        this.Productos = data.Productos;
        this.loading = false;
      });
  }
  QuitarCampos() {
    if (this.Datos.Entrega_Pendientes == 'Si') {
      this.Pendientes = 'table-cell';
    }
  }
  onFileDownload() {
    this.downloading = true;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .get(
        `${environment.base_url}/php/actarecepcion/descarga_pdf_acta_remision.php?tipo=Acta_Recepcion_Remision&id=${this.id}`,
        {
          responseType: 'blob' as 'json',
          headers,
        },
      )
      .subscribe({
        next: (file: any) => {
          this.downloading = false;
          downloadFile({ name: 'acta-recepcion-remision', file });
        },
      });
  }
}

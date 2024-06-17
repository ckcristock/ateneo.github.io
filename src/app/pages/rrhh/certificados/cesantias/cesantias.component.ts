import { Component, Input, OnInit } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { CertificadosService } from '../certificados.service';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { ImagePipe } from '../../../../core/pipes/image.pipe';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgFor, NgClass, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-cesantias',
  templateUrl: './cesantias.component.html',
  styleUrls: ['./cesantias.component.scss'],
  standalone: true,

  imports: [
    NgIf,
    NgFor,
    NgClass,
    MatPaginatorModule,
    NotDataComponent,
    DatePipe,
    UpperCasePipe,
    ImagePipe,
  ],
})
export class CesantiasComponent implements OnInit {
  @Input() filtro: any;
  layoffs: any[] = [];
  loading: boolean;
  paginationMaterial: any;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0,
  };
  constructor(
    private _swal: SwalService,
    private _certificados: CertificadosService,
  ) {}

  ngOnInit(): void {
    this.getLayoffsCertificates();
  }

  getLayoffsCertificates() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this._certificados.getLayoffsCertificates(params).subscribe((res: any) => {
      this.loading = false;
      this.layoffs = res.data.data;
      this.pagination.collectionSize = res.data.total;

      this.paginationMaterial = res.data;
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1;
        this.pagination.page = 1;
        this.getLayoffsCertificates();
      }
    });
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1;
    this.getLayoffsCertificates();
  }

  downloadSoporte(url) {
    window.open(url);
  }

  cambiarEstado(item, state) {
    const data = { state };
    const request = () => {
      this._certificados.updateLayoffsCertificate(item.id, data).subscribe({
        next: () => {
          this.getLayoffsCertificates();
          this._swal.success(
            state == 'aprobada' ? 'Cesantías aporbadas con éxito' : 'Cesantías rechazada con éxito',
          );
        },
        error: () => {
          this._swal.hardError();
        },
      });
    };

    this._swal.swalLoading(
      state == 'aprobada' ? 'Vamos a aprobar la solicitud' : 'Vamos a rechazar la solicitud',
      request,
    );
  }

  downloadComprobante(item: any) {
    const id = item.id;
    item.downloading = true;
    this._certificados.downloadComprobante(id).subscribe(
      (response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/pdf' });
        let link = document.createElement('a');
        const filename = 'comprobante';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        item.downloading = false;
      },
      (error) => {
        this._swal.hardError();
        item.downloading = false;
      },
      () => {
        item.downloading = false;
      },
    );
  }
}

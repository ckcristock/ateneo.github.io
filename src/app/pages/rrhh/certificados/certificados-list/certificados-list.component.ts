import { Component, Input, OnInit } from '@angular/core';
import { CertificadosService } from '../certificados.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { consts } from 'src/app/core/utils/consts';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { ImagePipe } from '../../../../core/pipes/image.pipe';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-certificados-list',
  templateUrl: './certificados-list.component.html',
  styleUrls: ['./certificados-list.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, MatPaginatorModule, NotDataComponent, DatePipe, ImagePipe],
})
export class CertificadosListComponent implements OnInit {
  @Input() filtro: any;
  certificates: any[] = [];
  public masks = consts.maskCOP;
  paginationMaterial: any;
  loading: boolean;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0,
  };

  constructor(
    private _certificados: CertificadosService,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.getWorkCertificates();
  }

  getWorkCertificates(): void {
    this.loading = true;
    const params = {
      ...this.pagination,
      ...this.filtro,
    };
    this._certificados.getWorkCertificates(params).subscribe((res: any) => {
      this.loading = false;
      this.certificates = res.data.data;
      this.pagination.collectionSize = res.data.total;

      this.paginationMaterial = res.data;
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1;
        this.pagination.page = 1;
        this.getWorkCertificates();
      }
    });
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1;
    this.getWorkCertificates();
  }

  download(item: any): void {
    const id = item.id;
    item.downloading = true;
    this._certificados.downloadLaboral(id).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        const filename = 'certificado';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        item.downloading = false;
      },
      () => {
        this._swal.hardError();
        item.downloading = false;
      },
      () => {
        item.downloading = false;
      },
    );
  }
}

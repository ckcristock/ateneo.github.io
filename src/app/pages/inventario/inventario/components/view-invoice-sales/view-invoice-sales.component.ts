import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity, ActivityComponent } from '@shared/components/activity/activity.component';

import { environment } from 'src/environments/environment';
import { RemisionService } from '../../../services/remision.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { CreditNotesComponent } from '../credit-notes/credit-notes.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ListItemsComponent } from '@app/components/list-items/list-items.component';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { downloadFile } from '@shared/functions/download-pdf.function';

@Component({
  selector: 'app-view-invoice-sales',
  standalone: true,
  imports: [
    CommonModule,
    ActivityComponent,
    CreditNotesComponent,
    NotDataComponent,
    ListItemsComponent,
    CabeceraComponent,
    TableComponent,
  ],
  templateUrl: './view-invoice-sales.component.html',
  styleUrl: './view-invoice-sales.component.scss',
})
export class ViewInvoiceSalesComponent implements OnInit {
  readonly ROUTE = environment.base_url;

  products = [];

  activities = [];

  details = {};

  resolution = {};

  datosCabecera = {
    Titulo: 'Seguimiento factura venta',
    Fecha: new Date(),
    Codigo: '',
  };

  userSignature = '';

  letterValue = 0;

  subtotal = 0;

  tax = 0;

  total = 0;

  id = 0;

  loading = true;

  downloading = false;

  constructor(
    private readonly remisionService: RemisionService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly userService: UserService,
  ) {
    this.id = +activatedRoute.snapshot.paramMap.get('id');
    this.userSignature = `${userService.user.person.first_name} ${userService.user.person.first_surname}`;
  }

  ngOnInit(): void {
    this.getInvoiceDetail();
  }

  private getInvoiceDetail(): void {
    this.remisionService.getInvoiceDetail(this.id).subscribe({
      next: (data) => {
        const res = data.data;
        this.details = res['Datos'] ?? {};
        this.datosCabecera.Codigo = 'FEI' + this.details['Codigo'];
        this.datosCabecera.Fecha = this.details['Fecha'];
        this.products = res['Productos'];
        this.activities = res['actividades'].map(
          (a) =>
            ({
              description: a.Detalles,
              date: a.Fecha,
              full_name: a.Funcionario,
            }) as Activity,
        );
        this.resolution = res['resolucion'];
        this.subtotal = +res['TotalFc'].TotalFac;
        this.letterValue = res['letra'];
        this.tax = res['TotalFc'].Iva;
        this.total = this.tax + this.subtotal;
        this.loading = false;
      },
    });
  }

  onDownloadPrint(id: number) {
    const params = {
      id,
    };
    this.downloading = true;
    this.remisionService.downloadPrintInvoice(params).subscribe({
      next: (file: any) => {
        downloadFile({ name: 'factura', file });
        this.downloading = false;
      },
      error: () => {
        this.downloading = false;
      },
    });
  }
}

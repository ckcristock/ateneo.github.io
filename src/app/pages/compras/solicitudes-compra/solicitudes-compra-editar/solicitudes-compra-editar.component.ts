import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { PlaceholderFormComponent } from '../../../../components/placeholder-form/placeholder-form.component';
import { SolicitudCompraCrearComponent } from '../solicitud-compra-crear/solicitud-compra-crear.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-solicitudes-compra-editar',
  templateUrl: './solicitudes-compra-editar.component.html',
  styleUrls: ['./solicitudes-compra-editar.component.scss'],
  standalone: true,
  imports: [NgIf, SolicitudCompraCrearComponent, PlaceholderFormComponent],
})
export class SolicitudesCompraEditarComponent implements OnInit {
  id: number;
  data: any[] = [];
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private _solicitudesCompra: SolicitudesCompraService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.getData();
    });
  }

  getData() {
    this.loading = true;
    this._solicitudesCompra.getDataPurchaseRequest(this.id).subscribe((r: any) => {
      this.data = r.data;
      this.loading = false;
    });
  }
}

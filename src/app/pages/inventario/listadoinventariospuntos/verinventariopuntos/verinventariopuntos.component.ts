import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventariofisicoService } from '../inventariofisico.service';
import { environment } from 'src/environments/environment';
import { NgIf, NgClass } from '@angular/common';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { HeaderDownloadComponent } from '../../../../shared/components/standard-components/header-download/header-download.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-verinventariopuntos',
  templateUrl: './verinventariopuntos.component.html',
  styleUrls: ['./verinventariopuntos.component.scss'],
  standalone: true,
  imports: [CardComponent, HeaderDownloadComponent, TableComponent, NgIf, NgClass],
})
export class VerinventariopuntosComponent implements OnInit {
  inventario: any = [];
  id_inventario;
  grupo;
  fecha_realizado;
  Cargando = false;

  // Titulo: `'Inventario Fisico Realizado: ${this.id_inventario} <br>'
  //   Grupo:${this.grupo}
  //   `,

  globales = environment;

  constructor(
    private _inventarioFisico: InventariofisicoService,
    private route: ActivatedRoute,
    // private _excel: ExcelService,
  ) {}

  ngOnInit() {
    this.id_inventario = this.route.snapshot.params['idInventario'];
    this.Cargando = true;
    this._inventarioFisico
      .getInventarioFisicoTerminadoPunto(this.id_inventario)
      .subscribe((res) => {
        if (res.Tipo == 'success') {
          this.inventario = res.Inventario;
          this.fecha_realizado = res.Inventario[0]['Fecha_Realizado'];
          this.grupo = res.Inventario[0]['Nombre_Grupo'];
        }
        this.Cargando = false;
      });
  }

  descargarExcel() {
    let descarga = this.inventario.map((i) => {
      return {
        Documento: i.Id_Doc_Inventario_Fisico_Punto,
        Estiba: i.Nombre_Estiba,
        Grupo: i.Nombre_Grupo,
        Producto: i.Nombre_Comercial,
        'Primer Conteo': i.Primer_Conteo,
        'Fecha Primer Conteo': i.Fecha_Primer_Conteo,
        'Segundo Conteo': i.Segundo_Conteo,
        'Fecha Segundo Conteo': i.Fecha_Segundo_Conteo,
        'Conteo Auditor': i.Cantidad_Auditada,
        'Cantidad Inventario': i.Cantidad_Inventario,
        Lote: i.Lote,
        Cum: i.Cum,
        'Fecha Vencimiento': i.Fecha_Vencimiento,
        Diferencia: i.Cantidad_Diferencial,
      };
    });

    // this._excel.exportAsExcelFile(descarga, 'Inventario', 'Inventario Punto');
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PuntosPipe } from '../../../core/pipes/puntos';
import { NgFor, NgIf, DecimalPipe, CurrencyPipe } from '@angular/common';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventarios-valorizados',
  templateUrl: './inventarios-valorizados.component.html',
  styleUrls: ['./inventarios-valorizados.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgFor,
    NgIf,
    DecimalPipe,
    CurrencyPipe,
    PuntosPipe,
  ],
})
export class InventariosValorizadosComponent implements OnInit {
  public Bodegas: any = [];
  public Departamentos: any = [];
  public totalBodega: number = 0;
  public totalDep: number = 0;
  public cargando: boolean = false;
  envirom: any;
  public Mes_Descarga: string;
  public Meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.ListaInventario();
    let fecha_actual = new Date();
    this.Mes_Descarga = fecha_actual.getFullYear() + '-' + fecha_actual.getMonth();
    this.envirom = environment;
  }

  ListaInventario() {
    this.cargando = true;
    this.http
      .get(
        environment.ruta + 'php/contabilidad/inventariovalorizado/lista_inventario_valorizado.php',
      )
      .subscribe((data: any) => {
        this.Bodegas = data.Bodegas;
        this.totalBodega = data.totalBodega;
        this.Departamentos = data.Departamentos;
        this.totalDep = data.totalDep;
        this.cargando = false;
      });
  }

  showDetail(pos) {
    $(`#detalle${pos}`).toggle();
  }

  Descargar() {
    window.open(
      environment.ruta +
        'php/contabilidad/inventariovalorizado/descar_inventario_valorizado.php?Fecha=' +
        this.Mes_Descarga,
    );
  }
}

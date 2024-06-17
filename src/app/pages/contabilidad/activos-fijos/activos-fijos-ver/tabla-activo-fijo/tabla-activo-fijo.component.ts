import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { UpperCasePipe, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-tabla-activo-fijo',
  templateUrl: './tabla-activo-fijo.component.html',
  styleUrls: ['./tabla-activo-fijo.component.scss'],
  standalone: true,
  imports: [UpperCasePipe, CurrencyPipe, DatePipe],
})
export class TablaActivoFijoComponent implements OnInit {
  alertSwal: any;
  public Activo_Fijo: any = {};
  constructor(
    private http: HttpClient,
    private readonly swalService: SwalService,
  ) {}
  @Input() Id;
  ngOnInit() {
    this.DetalleActivoFijo();
  }

  DetalleActivoFijo() {
    let p = { id_activo: this.Id };
    this.http
      .get(environment.base_url + '/php/activofijo/get_detalle_activo_fijo.php', { params: p })
      .subscribe((data: any) => {
        if ((data.codigo = 'success')) {
          this.Activo_Fijo = data;
        } else {
          this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        }
      });
  }
  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.icon = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.swalService.show(this.alertSwal);
  }
}

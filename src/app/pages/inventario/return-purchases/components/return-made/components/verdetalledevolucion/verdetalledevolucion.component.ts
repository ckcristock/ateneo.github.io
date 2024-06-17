import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Activity } from '@shared/components/activity/activity.component';
import { CurrencyPipe } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ActivityComponent } from '../../../../../../../shared/components/activity/activity.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-verdetalledevolucion',
  templateUrl: './verdetalledevolucion.component.html',
  styleUrls: ['./verdetalledevolucion.component.scss'],
  standalone: true,
  imports: [ActivityComponent, NotDataComponent, CurrencyPipe, CardComponent, TableComponent],
})
export class VerdetalledevolucionComponent implements OnInit {
  public Actividades: any[] = [];
  public IdDevolucion: number = 0;
  public Encabezado: any = {
    Nombre_Funcionario: '',
    Nombre_Proveedor: '',
    Nit: '',
    Nombre_Bodega: '',
  };
  public Productos_No_Conforme: any = [];
  public Totales: any = {
    Subtotal: 0,
    Iva: 0,
    Total: 0,
  };

  globales = environment;

  loading = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
    let id = this.route.snapshot.params['id'];
    this.IdDevolucion = id;
    this.http
      .get(this.globales.base_url + '/php/noconforme/actividades_devolucion.php', {
        params: { id, tipo: 'Devolucion' },
      })
      .subscribe((data: any) => {
        this.Actividades = data.map(
          (a) =>
            ({
              description: a.Detalles,
              date: a.Fecha,
              full_name: a.Funcionario,
              image: a.Imagen,
            }) as Activity,
        );
      });
  }

  ngOnInit() {
    this.ConsultarInfoDevolucion(this.IdDevolucion);
  }

  ConsultarInfoDevolucion(id: number) {
    let strId = id.toString();

    this.http
      .get(this.globales.base_url + '/php/devoluciones/detalle_devolucion.php', {
        params: { id_devolucion: strId },
      })
      .subscribe((data: any) => {
        this.Encabezado = data.encabezado;
        this.Productos_No_Conforme = data.no_conformes;
        this.CalcularTotales();
        this.loading = false;
      });
  }

  CalcularTotales() {
    let subtotal = 0;
    let iva = 0;
    let total = 0;
    this.Productos_No_Conforme.forEach((element) => {
      let st = parseInt(element.Cantidad) * parseInt(element.Costo);
      subtotal += st;

      if (element.Impuesto == '') {
        iva += 0;
      } else {
        iva += st * (parseInt(element.Impuesto) / 100);
      }
    });

    total = subtotal + iva;

    this.Totales.Subtotal = subtotal;
    this.Totales.Iva = iva;
    this.Totales.Total = total;
  }
}

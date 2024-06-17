import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Activity } from '@shared/components/activity/activity.component';
import { LoadImageComponent } from '../../../../shared/components/load-image/load-image.component';
import { NgIf, CurrencyPipe, DatePipe } from '@angular/common';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ActivityComponent } from '../../../../shared/components/activity/activity.component';

@Component({
  selector: 'app-ajustesinventariover',
  templateUrl: './ajustesinventariover.component.html',
  styleUrls: ['./ajustesinventariover.component.scss'],
  standalone: true,
  imports: [
    ActivityComponent,
    CardComponent,
    TableComponent,
    NgIf,
    LoadImageComponent,
    CurrencyPipe,
    DatePipe,
  ],
})
export class AjustesinventarioverComponent implements OnInit {
  public Ajustes: any = [];
  public productos: any = [];
  public encabezado: any = [];
  public id = '';
  public Total = 0;
  public Actividades: any = [];
  public reducer = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Costo) * parseInt(currentValue.Cantidad);

  globales = environment;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.detalles();
  }

  ngOnInit() {}

  detalles() {
    this.id = this.route.snapshot.params['id'];

    this.http
      .get(this.globales.ruta + 'php/ajusteindividual/detalle_ajuste1.php', {
        params: { id: this.id },
      })
      .subscribe((data: any) => {
        this.Ajustes = data;

        this.Ajustes.forEach((element) => {
          this.http
            .get(
              this.globales.ruta + 'php/ajuste_individual_nuevo/actividades_ajuste_individual.php',
              { params: { Id_Ajuste: element.Id_Ajuste_Individual } },
            )
            .subscribe((data: any) => {
              if (data.type == 'success') {
                element.Actividades = data.data.map(
                  (res) =>
                    ({
                      date: res.Fecha,
                      description: res.Detalles,
                      full_name: res.Funcionario,
                      image: res.Imagen,
                      title: '',
                    }) as Activity,
                );
              }
            });
        });
      });
  }
}

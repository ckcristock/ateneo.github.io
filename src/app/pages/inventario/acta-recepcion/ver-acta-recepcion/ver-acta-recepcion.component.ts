import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ActaRecepcionService } from '../acta-recepcion.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { UserService } from 'src/app/core/services/user.service';
import { PlaceholderFormComponent } from '../../../../components/placeholder-form/placeholder-form.component';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';
import { NgIf, NgFor, UpperCasePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { skipContentType } from '@app/http.context';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';

@Component({
  selector: 'app-ver-acta-recepcion',
  templateUrl: './ver-acta-recepcion.component.html',
  styleUrls: ['./ver-acta-recepcion.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CabeceraComponent,
    RouterLink,
    PlaceholderFormComponent,
    UpperCasePipe,
    DecimalPipe,
    TitleCasePipe,
    ViewMoreComponent,
  ],
})
export class VerActaRecepcionComponent implements OnInit {
  loading: boolean;
  data: any[] = [];
  user_id: any;
  ActividadesActa: any[] = [];
  id = this.route.snapshot.params['id'];
  datosCabecera = {
    Titulo: 'Acta de recepción',
    Fecha: '',
    Codigo: '',
  };

  reducer_subt = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  reducer_iva = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Subtotal) * (parseInt(currentValue.Impuesto) / 100);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _actaRecepcion: ActaRecepcionService,
    private _swal: SwalService,
    private _user: UserService,
  ) {
    this.user_id = _user.user.person.id;
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.loading = true;
    let params: any = {
      id: this.id,
    };
    this._actaRecepcion.detalleActa(params).subscribe((res: any) => {
      this.data = res.data;
      this.loading = false;
      this.datosCabecera.Codigo = res.data.Codigo;
      this.datosCabecera.Fecha = res.data.Fecha_Creacion;
    });
  }

  aprobarActa(id, Id_Bodega_Nuevo) {
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a aprobar el acta de recepción ',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          let datos = new FormData();
          datos.append('id', id);
          datos.append('Id_Bodega_Nuevo', Id_Bodega_Nuevo);
          datos.append('funcionario', this.user_id);
          this.http
            .post(environment.base_url + '/php/actarecepcion_nuevo/aprobar_acta.php', datos, {
              context: skipContentType(),
            })
            .subscribe((data: any) => {
              this._swal.show({
                icon: 'success',
                title: 'Operación exitosa',
                text: data.mensaje,
                showCancel: false,
                timer: 1000,
              });
              this.init();
            });
        }
      });
  }

  AsignarClaseLabel(estado: string): string {
    var clase = 'label';

    switch (estado) {
      case 'Creacion':
        clase += ' label-info';
        break;

      case 'Edicion':
        clase += ' label-warning';
        break;

      case 'Anulada':
        clase += ' label-danger';
        break;

      case 'Aprobacion':
        clase += ' label-success';
        break;

      case 'Recepcion':
        clase += ' label-1';
        break;

      default:
        break;
    }

    return clase;
  }
}

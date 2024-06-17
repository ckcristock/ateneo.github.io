import { Component, OnInit } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { Globales } from '../../../../globales';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalService } from '../../../../../ajustes/informacion-base/services/swal.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CabeceraComponent } from '../../../../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-mediomagneticoagrupacioncrear',
  templateUrl: './mediomagneticoagrupacioncrear.component.html',
  styleUrls: ['./mediomagneticoagrupacioncrear.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgFor,
    NgSelectModule,
    NgIf,
  ],
})
export class MediomagneticoagrupacioncrearComponent implements OnInit {
  public datosCabecera: any = {
    Titulo: 'Agrupar medios magnéticos',
    Fecha: new Date(),
  };

  public MediosMagModel: any = {
    Codigo_Formato: '',
    Nombre_Formato: '',
  };

  public Formatos: any = [
    {
      Formato: '',
    },
  ];
  public listaFormatosEspeciales: Array<any>;
  public alertOption: SweetAlertOptions;

  constructor(
    private globales: Globales,
    private http: HttpClient,
    private router: Router,
    private swalService: SwalService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getListaFormatosEspeciales();

    let id = this.route.snapshot.params.id;

    if (id !== null && id !== undefined) {
      this.getDetallesFormato(id);
    }
  }

  onSaveFormat() {
    const request = () => {
      this.guardarMediosMag();
    };
    this.swalService.swalLoading('Se dispone a guardar este formato', request);
  }

  nuevoFormato(pos) {
    let pos2 = pos + 1;

    if (this.Formatos[pos2] == undefined) {
      let obj: any = {
        Formato: '',
      };

      this.Formatos.push(obj);
    }
  }

  eliminarFila(pos) {
    this.Formatos.splice(pos, 1);
  }

  guardarMediosMag() {
    let info = this.globales.normalize(JSON.stringify(this.MediosMagModel));
    let formatos = this.globales.normalize(JSON.stringify(this.Formatos));

    let datos = new FormData();

    datos.append('datos', info);
    datos.append('formatos', formatos);

    this.http
      .post(
        environment.ruta + 'php/contabilidad/mediosmagneticos/guardar_agrupacion_especiales.php',
        datos,
      )
      .subscribe(
        (data: any) => {
          if (data.tipo == 'success') {
            Swal.fire({
              icon: data.tipo,
              title: data.titulo,
              text: data.mensaje,
            });
            // this.swalService.ShowMessage(swal);

            setTimeout(() => {
              this.router.navigate(['/contabilidad/informesdian/agruparmediosmagneticos']);
            }, 300);
          }
        },
        (error) => {
          Swal.fire({
            icon: 'warning',
            text: 'Se perdió la conexión a internet. Por favor vuelve a intentarlo',
            title: 'Oops!',
          });
          // this.swalService.ShowMessage(swal);
        },
      );
  }

  getListaFormatosEspeciales() {
    this.http
      .get(environment.base_url + '/php/contabilidad/mediosmagneticos/formatos_especiales.php')
      .subscribe((data: any) => {
        this.listaFormatosEspeciales = data;
      });
  }

  getDetallesFormato(id) {
    let p = { id: id };

    this.http
      .get(environment.ruta + 'php/contabilidad/mediosmagneticos/detalles_formatos_agrup.php', {
        params: p,
      })
      .subscribe((data: any) => {
        this.MediosMagModel = data.encabezado;
        this.Formatos = data.formatos;

        setTimeout(() => {
          let obj: any = {
            Formato: '',
          };

          this.Formatos.push(obj);
        }, 300);
      });
  }
}

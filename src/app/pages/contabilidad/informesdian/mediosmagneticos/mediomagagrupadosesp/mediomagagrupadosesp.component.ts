import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Globales } from '../../../globales';
import { SweetAlertOptions } from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mediomagagrupadosesp',
  templateUrl: './mediomagagrupadosesp.component.html',
  styleUrls: ['./mediomagagrupadosesp.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgFor,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NotDataComponent,
  ],
})
export class MediomagagrupadosespComponent implements OnInit {
  public listaMediosMag: any = [];
  public alertOption: SweetAlertOptions;
  public IdMedioMag: string = '';
  public Cargando: boolean = true;
  enviromen: any;

  constructor(
    public globales: Globales,
    private http: HttpClient,
    private swalService: SwalService,
  ) {}

  ngOnInit() {
    this.listaFormatosAgrupados();
    this.enviromen = environment;
  }

  onRemoveFormat() {
    const request = () => {
      this.eliminarMedioMag();
    };
    this.swalService.swalLoading('Se dispone a eliminar este formato', request);
  }

  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros;
  }

  listaFormatosAgrupados() {
    this.http
      .get(
        environment.ruta +
          'php/contabilidad/mediosmagneticos/lista_medios_magneticos_agrupados.php',
      )
      .subscribe((data: any) => {
        this.Cargando = false;
        this.listaMediosMag = data;
      });
  }

  eliminarMedioMag() {
    let p = { id: this.IdMedioMag };

    this.http
      .get(
        environment.ruta +
          'php/contabilidad/mediosmagneticos/eliminar_mediomagnetico_agrupados.php',
        { params: p },
      )
      .subscribe(
        (data: any) => {
          Swal.fire({
            icon: data.tipo,
            title: data.titulo,
            text: data.mensaje,
          });
          // this.swalService.ShowMessage(swal);
          this.listaFormatosAgrupados();
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
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Router, RouterLink } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-mediosmagneticos',
  templateUrl: './mediosmagneticos.component.html',
  styleUrls: ['./mediosmagneticos.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgFor,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NotDataComponent,
  ],
})
export class MediosmagneticosComponent implements OnInit {
  public listaMediosMag: any = [];
  public alertOption: SweetAlertOptions;
  public IdMedioMag = '';
  public url: string = this.router.url;
  public Cargando: boolean = true;
  public formatoEspecial: boolean = false;
  enviromen: any;

  constructor(
    private http: HttpClient,
    private swalService: SwalService,
    private router: Router,
  ) {
    this.formatoEspecial = this.isFormatoEspecial();
  }

  ngOnInit() {
    this.getListaMediosMag();
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

  getListaMediosMag() {
    let p: any = {};

    if (this.formatoEspecial) {
      p.Tipo = 'Especial';
    }

    this.http
      .get(
        environment.base_url + '/php/contabilidad/mediosmagneticos/lista_medios_magneticos.php',
        { params: p },
      )
      .subscribe((data: any) => {
        this.Cargando = false;
        this.listaMediosMag = data;
      });
  }

  eliminarMedioMag() {
    let p = { id: this.IdMedioMag };

    this.http
      .get(environment.ruta + 'php/contabilidad/mediosmagneticos/eliminar_mediomagnetico.php', {
        params: p,
      })
      .subscribe(
        (data: any) => {
          Swal.fire({
            icon: data.tipo,
            title: data.titulo,
            text: data.mensaje,
          });
          // this.swalService.ShowMessage(swal);

          this.getListaMediosMag();
        },
        (error) => {
          Swal.fire({
            icon: 'warning',
            title: 'Se perdió la conexión a internet. Por favor vuelve a intentarlo',
            text: 'Oops!',
          });
          // this.swalService.ShowMessage(swal);
        },
      );
  }

  isFormatoEspecial(): boolean {
    let str = this.url.indexOf('especiales');

    if (str >= 0) {
      return true;
    }

    return false;
  }
}

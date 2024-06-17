import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { skipContentType } from 'src/app/http.context';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { TableComponent } from '@app/shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-ajustar-documentos',
  templateUrl: './ajustar-documentos.component.html',
  styleUrls: ['./ajustar-documentos.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, TableComponent],
})
export class AjustarDocumentosComponent implements OnInit {
  public DatosCabecera: any = {
    Titulo: 'Inventario físico estibas.',
    Fecha: new Date(),
    Codigo: '',
  };

  productos: any = {};
  Id_Estiba;
  Funcionario_Autoriza;
  public alertOpt: SweetAlertOptions = {};
  @ViewChild('respuestaSwal') respuestaSwal: any;
  @ViewChild('respuestaRedirectSwal') respuestaRedirectSwal: any;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _swal: SwalService,
  ) {
    ///// eliminar
    // this.alertOpt = {
    //   title: 'Guardar inventario final',
    //   text: '¿Estás seguro(a)?',
    //   confirmButtonText: 'Si, Terminar el inventario',
    //   showCancelButton: true,
    //   cancelButtonText: 'No, Dejame Comprobar!',
    //   icon: 'question',
    //   preConfirm: () => {
    //     this.guardarFinal();
    //   },
    //   allowOutsideClick: () => !swal.isLoading(),
    // };

    try {
      this._swal.confirm(`¿Estas seguro(a) de guardar inventario final?`, {
        preConfirm: () => {
          this.guardarFinal();
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this._swal.hardError();
    }
  }

  ngOnInit() {
    this.Id_Estiba = this.route.snapshot.params['idEstiba'];

    let params = this.route.snapshot.queryParams;
    if (params.func != undefined) {
      this.Funcionario_Autoriza = params.func;
    }

    let param: any = {};
    param.Id_Estiba = this.Id_Estiba;

    this.GetDocumentosParaAjustar(params).subscribe({
      next: (res: any) => {
        if (res.tipo != 'error') {
          this.productos = res.data.productos;
          let swal = {
            icon: res.tipo,
            title: res.titulo,
            text: res.mensaje,
          };
          this._swal.show(swal);
        } else {
          let swal = {
            icon: res.tipo,
            title: res.titulo,
            text: res.mensaje,
          };
          this._swal.show(swal);
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this._swal.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this._swal.incompleteError(formattedErrorMessage);
        }
      },
    });
  }

  GetDocumentosParaAjustar(p: any) {
    return this.http.get(
      environment.base_url + '/php/inventariofisico/estiba/documentos_para_ajustar.php',
      { params: p },
    );
  }

  guardarFinal() {
    let listado = JSON.stringify(this.productos);
    let datos = new FormData();
    datos.append('listado_inventario', listado);
    datos.append('id_funcionario', this.Funcionario_Autoriza);
    datos.append('productos', listado);
    this.SaveInventarioFinalEstiba(datos).subscribe({
      next: (res: any) => {
        if (res.tipo == 'success') {
          let swal = {
            icon: res.tipo,
            title: res.titulo,
            text: res.mensaje,
          };
          this._swal.ShowMessage(swal);
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this._swal.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this._swal.incompleteError(formattedErrorMessage);
        }
      },
    });
  }
  SaveInventarioFinalEstiba(data: FormData) {
    return this.http.post(
      environment.base_url + '/php/inventariofisico/estiba/guardar_inventario_final.php',
      data,
      {
        context: skipContentType(),
      },
    );
  }

  editarProducto(producto) {
    producto.editar = true;
  }
}

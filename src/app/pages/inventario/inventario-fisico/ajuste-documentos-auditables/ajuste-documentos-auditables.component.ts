import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InventariofisicoService } from '../../services/inventariofisico.service';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { TableComponent } from '@app/shared/components/standard-components/table/table.component';
import { NgClass } from '@angular/common';
import { NotDataSaComponent } from '@app/components/not-data-sa/not-data-sa.component';

@Component({
  selector: 'app-ajuste-documentos-auditables',
  templateUrl: './ajuste-documentos-auditables.component.html',
  styleUrls: ['./ajuste-documentos-auditables.component.scss'],
  standalone: true,
  imports: [CabeceraComponent, TableComponent, NgClass, NotDataSaComponent],
})
export class AjusteDocumentosAuditablesComponent implements OnInit {
  public DatosCabecera: any = {
    Titulo: 'Inventario Fisico Estibas--',
    Fecha: new Date(),
    Codigo: '',
  };

  productos: any = {};
  Id_Bodega: any;
  Funcionario_Autoriza: any;
  documento: string;
  public cargando: boolean = false;

  public alertOpt: SweetAlertOptions = {};
  @ViewChild('respuestaSwal') respuestaSwal: any;
  @ViewChild('respuestaRedirectSwal') respuestaRedirectSwal: any;
  constructor(
    public router: Router,
    private inventarioFisico: InventariofisicoService,
    private route: ActivatedRoute,
    private _swal: SwalService,
  ) {}

  ngOnInit() {
    this.Id_Bodega = this.route.snapshot.params['idBodega'];

    let params = this.route.snapshot.queryParams;
    if (params.func != undefined) {
      this.Funcionario_Autoriza = params.func;
    }

    let param: any = {};

    param.Id_Bodega = this.Id_Bodega;

    this.cargando = true;

    this.inventarioFisico.GetDocumentosParaAjustarAuditables(param).subscribe({
      next: (res: any) => {
        this.documento = res.documento;
        this.productos = res.data.productos;

        let swal = {
          icon: res.icon,
          title: res.titulo,
          text: res.mensaje,
        };
        this._swal.ShowMessage(swal);
        this.cargando = false;
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
        try {
          this.router.navigate(['inventario/inventario-fisico']);
        } catch (error) {
          this._swal.hardError();
        }
      },
    });
  }

  guardarFinal() {
    const request = () => {
      let listado = JSON.stringify(this.productos);
      let datos = new FormData();

      datos.append('listado_inventario', listado);
      datos.append('id_funcionario', this.Funcionario_Autoriza);
      datos.append('productos', listado);
      datos.append('inventarios', this.documento);

      this.inventarioFisico.SaveInventarioFinalEstibaAuditor(datos).subscribe({
        next: (res: any) => {
          if (res.tipo == 'success') {
            ///// borrar
            // this.respuestaRedirectSwal.type = res.tipo;
            // this.respuestaRedirectSwal.title = res.titulo;
            // this.respuestaRedirectSwal.text = res.mensaje;
            // this.respuestaRedirectSwal.show();
            let swal = {
              type: res.tipo,
              title: res.titulo,
              text: res.mensaje,
            };
            this._swal.ShowMessage(swal);
            this.router.navigate(['/listadoinventarios']);
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
    };
    this._swal.swalLoading(`Vamos a guardar el inventario final.`, request);
  }

  editarProducto(producto) {
    producto.editar = true;
  }
}


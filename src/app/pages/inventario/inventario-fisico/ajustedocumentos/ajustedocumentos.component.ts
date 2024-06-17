import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InventariofisicoService } from '../../services/inventariofisico.service';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { TableComponent } from '@app/shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@app/shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { NgClass, NgIf, NgFor, DecimalPipe } from '@angular/common';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-ajustedocumentos',
  templateUrl: './ajustedocumentos.component.html',
  styleUrls: ['./ajustedocumentos.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    TableComponent,
    DropdownActionsComponent,
    NgClass,
    NgIf,
    NgFor,
    DecimalPipe,
  ],
  providers: [ExcelService],
})
export class AjustedocumentosComponent implements OnInit {
  @ViewChild('respuestaRedirectSwal') respuestaRedirectSwal: any;
  public alertOpt: SweetAlertOptions = {};
  public DatosCabecera: any = {
    Titulo: 'Inventario físico estibas',
    Fecha: new Date(),
    Codigo: '',
  };
  Id_Estiba;
  Funcionario_Autoriza;
  productos: any = {};
  loading: boolean = false;

  constructor(
    public router: Router,
    private inventarioFisico: InventariofisicoService,
    private route: ActivatedRoute,
    private readonly swalService: SwalService,
    private _excel: ExcelService,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.Id_Estiba = this.route.snapshot.params['idEstiba'];

    let params = this.route.snapshot.queryParams;
    if (params.func != undefined) {
      this.Funcionario_Autoriza = params.func;
    }

    let param: any = {};
    param.Id_Estiba = this.Id_Estiba;

    this.inventarioFisico.GetDocumentosParaAjustar(param).subscribe({
      next: (res: any) => {
        if (res.tipo != 'error') {
          this.productos = res.data.productos;
          this.loading = false;
          let swal = {
            icon: res.tipo,
            title: res.titulo,
            text: res.mensaje,
            showCancel: false,
          };
          this.swalService.show(swal);
          this.DatosCabecera.Codigo = res.code;
        } else {
          let swal = {
            icon: res.tipo,
            title: res.titulo,
            text: res.mensaje,
            showCancel: false,
          };
          this.swalService.show(swal);
          this.router.navigate(['inventario/inventario-fisico']);
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this.swalService.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this.swalService.incompleteError(formattedErrorMessage);
        }
      },
    });
  }

  guardarFinal() {
    const request = (resolve: any) => {
      let jsonPams = {
        listado_inventario: this.productos,
      };
      // datos.append('id_funcionario', this.Funcionario_Autoriza);
      this.inventarioFisico.SaveInventarioFinalEstibaWithToken(jsonPams).subscribe({
        next: (res: any) => {
          if (res.tipo == 'success') {
            this.router.navigate(['inventario/inventario-fisico']);
            let swal = {
              icon: 'success',
              title: res.titulo,
              text: res.mensaje,
              showCancel: false,
            };
            this.swalService.show(swal);
            resolve(true);
          }
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
          if (error.error.error) {
            errorMessage = error.error.error;
            this.swalService.hardError();
          } else if (error.error.errors) {
            let errorMessages: string[] = [];
            for (const field in error.error.errors) {
              errorMessages.push(error.error.errors[field]);
            }
            const formattedErrorMessage = errorMessages.join('<br/>');
            this.swalService.incompleteError(formattedErrorMessage);
          }
        },
      });
    };
    this.swalService.swalLoading(`Vamos a guardar el inventario final.`, request);
  }

  editarProducto(producto) {
    producto.editar = true;
  }
  descargarInforme() {
    let inventario = this.productos.map((p) => {
      let cantFinal =
        p.Cantidad_Auditada !== '' && p.Cantidad_Auditada != '0'
          ? p.Cantidad_Auditada
          : p.Segundo_Conteo;
      return {
        'Doc Inventario Fisico': p.Id_Doc_Inventario_Fisico,
        'Nombre Comercial': p.Nombre_Comercial,
        'Nombre Producto': p.Nombre_Producto,
        Estiba: p.Nombre_Estiba,
        Grupo: p.Nombre_Grupo,
        'Primer Conteo': Number(p.Primer_Conteo),
        'Segundo Conteo': Number(p.Segundo_Conteo),
        'Cantidad Final': Number(cantFinal),
        Diferencia: p.Cantidad_Diferencial,
      };
    });
    try {
      this._excel.exportAsExcelFile(inventario, 'Inventario Terminado');
    } catch (error) {
      console.log('error', error);
    }
  }

  updateCantidadFinal(producto: any, cantidadFinal: number): void {
    if (producto) {
      producto.Cantidad_Auditada = cantidadFinal;
    }
  }
}

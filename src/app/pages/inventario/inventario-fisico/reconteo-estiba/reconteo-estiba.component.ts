import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { environment } from 'src/environments/environment';
import { InventariofisicoService } from '../../services/inventariofisico.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { skipContentType } from 'src/app/http.context';
import { NgClass, DecimalPipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '@app/shared/components/standard-components/table/table.component';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';

@Component({
  selector: 'app-reconteo-estiba',
  templateUrl: './reconteo-estiba.component.html',
  styleUrls: ['./reconteo-estiba.component.scss'],
  standalone: true,
  imports: [CabeceraComponent, FormsModule, NgClass, TableComponent, DecimalPipe, UpperCasePipe],
})
export class ReconteoEstibaComponent implements OnInit {
  public DatosCabecera: any = {
    Titulo: 'Reconteo inventario físico estibas',
    Fecha: new Date(),
    Codigo: '',
  };

  public Inventario_Diferencial_Lotes: any = [];
  public Inventario_Sin_Diferencia: any = [];
  public Inventarios: any = '';
  public alertOptionInventario: any = {};
  public Funcionario_Autoriza: '';
  public Productos = {};
  loading: boolean = false;
  loadingDownload: boolean = false;

  _swalService = inject(SwalService);
  http = inject(HttpClient);
  inventariofisico = inject(InventariofisicoService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  public Id_Inventario = this.route.snapshot.params['idInventarioEstiba'];

  ngOnInit() {
    let param: any = {};

    this.ValidarInventario();

    let params = this.route.snapshot.queryParams;
    if (params.func != undefined) {
      this.Funcionario_Autoriza = params.func;
    }
  }

  onRegisterInventory() {
    this._swalService.customAlert(this.alertOptionInventario);
  }

  ValidarInventario() {
    this.loading = true;
    this.ValidarInventarioEstiba(this.Id_Inventario).subscribe({
      next: async (data: any) => {
        if (data.tipo == 'success') {
          this.Inventario_Diferencial_Lotes = Object.values(data.Productos);
          this.Inventario_Sin_Diferencia = Object.values(data.Productos_Sin_Diferencia);
          this.Inventarios = data.Inventarios;
          this.DatosCabecera.Codigo = data.Codigo;
          this.loading = false;

          //cambiar estado para que no puedan entrar
          let datos = new FormData();
          datos.append('Id_Doc_Inventario_Fisico', this.Id_Inventario);
          datos.append('tipo_accion', 'Haciendo Segundo Conteo');
          await this.GestionarEstado(datos).toPromise();
        } else {
          let swal = {
            icon: data.tipo,
            title: data.titulo,
            text: data.mensaje,
          };
          this.loading = false;

          this._swalService.show(swal).then((res) => {
            if (res.isConfirmed) this.router.navigate(['/inventario/inventario-fisico']);
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this._swalService.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this._swalService.incompleteError(formattedErrorMessage);
        }
      },
    });
  }

  ValidarInventarioEstiba(p: string) {
    return this.http.get(
      environment.base_url + '/php/inventariofisico/estiba/validar_inventario.php?inv=' + p,
    );
  }

  public GestionarEstado(data: FormData) {
    return this.http.post(
      environment.base_url + '/php/inventariofisico/estiba/gestion_de_estado.php',
      data,
      {
        context: skipContentType(),
      },
    );
  }

  ListarProductosSinDiferencia(inventarios) {
    this.GetProductosSinDiferencia(inventarios).subscribe({
      next: (data: any) => {
        this.Inventario_Sin_Diferencia = data;
        localStorage.setItem(
          'Productos_Sin_Diferencia',
          functionsUtils.normalize(JSON.stringify(data)),
        );
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this._swalService.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this._swalService.incompleteError(formattedErrorMessage);
        }
      },
    });
  }

  GetProductosSinDiferencia(p: any) {
    return this.http.get(
      environment.base_url + '/php/inventariofisico/inventario_sin_diferencia_barrido.php?inv=' + p,
    );
  }

  guardarLocalStg() {
    localStorage.setItem(
      'Productos_Diferencia',
      functionsUtils.normalize(JSON.stringify(this.Inventario_Diferencial_Lotes)),
    );
  }

  guardarInventarioFinal() {
    let listado = JSON.stringify(this.Inventario_Diferencial_Lotes);
    let datos = new FormData();
    datos.append('listado_inventario', listado);
    // datos.append('id_funcionario', this.Funcionario_Autoriza);
    datos.append('inventarios', this.Inventarios);

    let jsonParams = {
      listado_inventario: { ...this.Inventario_Diferencial_Lotes },
      inventarios: this.Inventarios,
    };

    const request = () => {
      this.SaveReconteo(jsonParams).subscribe({
        next: (data: any) => {
          if (data.tipo == 'success') {
            let swal = {
              icon: data.tipo,
              title: data.titulo,
              text: data.mensaje,
              showCancel: false,
            };
            this._swalService.show(swal);
            this.Inventario_Diferencial_Lotes = [];
            this.Inventario_Sin_Diferencia = [];
            this.router.navigate(['/inventario/inventario-fisico']);
          }
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
          if (error.error.error) {
            errorMessage = error.error.error;
            this._swalService.hardError();
          } else if (error.error.errors) {
            let errorMessages: string[] = [];
            for (const field in error.error.errors) {
              errorMessages.push(error.error.errors[field]);
            }
            const formattedErrorMessage = errorMessages.join('<br/>');
            this._swalService.incompleteError(formattedErrorMessage);
          }
        },
      });
    };
    this._swalService.swalLoading(`Vamos  registrar el inventario final`, request);
  }

  SaveReconteo(data: any) {
    return this.http.post(
      environment.base_url + '/php/inventariofisico/estiba/guardar_reconteo.php',
      data,
    );
  }

  VerPantallaLista() {
    this.router.navigate(['/ajusteinventariofisico']);
  }

  DecargarInforme() {
    this.loadingDownload = true;
    let data = new FormData();
    let info = JSON.stringify(this.Inventario_Diferencial_Lotes);
    const productosJSON = {
      productos: { ...this.Inventario_Diferencial_Lotes },
    };
    data.append('productos', info);
    this.inventariofisico.DescargarInformeEstiba(productosJSON).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = `informe-inventario-fisico-${this.Id_Inventario}`;
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      this.loadingDownload = false;
      link.click();
    });
  }

  async getInventario() {}

  updateCantidadFinal(Id_Producto: number, cantidadFinal: number): void {
    const item = this.Inventario_Diferencial_Lotes.find((i) => i.Id_Producto === Id_Producto);
    if (item) {
      item.Cantidad_Final = cantidadFinal;
    }
  }
}

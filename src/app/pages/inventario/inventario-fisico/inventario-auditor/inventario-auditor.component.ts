import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Globales } from 'src/app/pages/inventario/services/globales-datos';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NgIf, NgFor } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventario-auditor',
  templateUrl: './inventario-auditor.component.html',
  styleUrls: ['./inventario-auditor.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
  providers: [Globales],
})
export class InventarioAuditorComponent implements OnInit {
  public productos: any = [];
  public cantidad: number = 0;
  public bodega: string;
  public documento: string;
  public inventario: any = [];
  public Cargando: boolean = false;

  public inventory = {
    cantidad: '',
  };

  constructor(
    private http: HttpClient,
    public globales: Globales,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private swalService: SwalService,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.bodega = params['bodega'];
      this.documento = params['doc'];
    });
  }

  ngOnInit() {
    this.Cargando = true;
    this.http
      .get(environment.base_url + '/php/inventario_auditor/inventario.php?bodega=' + this.bodega)
      .subscribe({
        next: (data: any) => {
          this.productos = data.query_result;
          this.productos.forEach((element) => {
            this.cantidad += element.Inventario.length;
          });

          this.Cargando = false;
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

  saveInventario() {
    if (this.cantidad != this.inventario.length) {
      this.swalService.ShowMessage(['warning', 'Alerta', 'Debe llenar todos los campos cantidad!']);
      return;
    }

    let datos = new FormData();
    datos.append('data', JSON.stringify(this.inventario));
    datos.append('bodega', JSON.stringify(this.bodega));
    datos.append('documento', JSON.stringify(this.documento));

    this.http
      .post(environment.base_url + '/php/inventario_auditor/saveconteo_custom.php', datos)
      .subscribe({
        next: (data: any) => {
          if (data.tipo == 'success') {
            this.router.navigate(['listadoinventarios']);
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

  AgregaFila(pos: number, producto: any, inventario: any) {
    if (this.validarEstiba(producto, inventario)) {
      this.inventario.push({
        producto: producto.Id_Producto,
        inventario: inventario,
      });
    }
  }

  validarEstiba(producto: any, inventario: any) {
    let flag = true;
    this.inventario.forEach((inventory, index) => {
      if (
        inventory.producto == producto.Id_Producto &&
        inventory.inventario.Estiba == inventario.Estiba &&
        inventory.inventario.Lote == inventario.Lote
      ) {
        flag = false;
      }
    });
    return flag;
  }
}


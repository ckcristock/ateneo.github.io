import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { InventariofisicoService } from '../../services/inventariofisico.service';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-inventario-reconteo',
  templateUrl: './inventario-reconteo.component.html',
  styleUrls: ['./inventario-reconteo.component.scss'],
  standalone: true,
  imports: [CabeceraComponent, FormsModule, NgIf, NgFor],
})
export class InventarioReconteoComponent implements OnInit {
  public DatosCabecera: any = {
    Titulo: 'Reconteo Inventario Fisico Estibas',
    Fecha: new Date(),
    Codigo: '',
  };
  public Id_Inventario = this.route.snapshot.params['idInventarioEstiba'];

  public Inventario_Diferencial: any = [];
  public Inventario_Sin_Diferencia: any = [];
  public Inventarios: any = '';
  public alertOptionInventario: SweetAlertOptions = {};
  public Funcionario_Autoriza: '';
  public Productos = {};

  public Cargando: boolean = false;

  @ViewChild('confirmacionSalir') confirmacionSalir: any;

  constructor(
    private _generalService: GeneralService,
    private _swalService: SwalService,
    private _toastService: ToastService,

    private inventariofisico: InventariofisicoService,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.alertOptionInventario = {
      title: '¿Está Seguro?',
      text: 'Se dispone a registrar el inventario final',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          this.guardarInventarioFinal();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  ngOnInit() {
    let param: any = {};
    this.ValidarInventario();

    let params = this.route.snapshot.queryParams;
    if (params.func != undefined) {
      this.Funcionario_Autoriza = params.func;
    }
  }

  ValidarInventario() {
    this.Cargando = true;

    this.inventariofisico
      .ValidarInventarioAuditable(this.Id_Inventario)
      .subscribe(async (data: any) => {
        if (data.tipo == 'success') {
          this.Inventario_Diferencial = data.Productos;
          this.Inventario_Sin_Diferencia = data.Productos_Sin_Diferencia;
          this.Inventarios = data.Inventarios;

          // cambiar estado para que no puedan entrar
          let datos = new FormData();
          datos.append('Id_Doc_Inventario_Auditable', this.Id_Inventario);
          datos.append('tipo_accion', 'Haciendo Segundo Conteo');
          await this.inventariofisico.GestionarEstado_Custom(datos).toPromise();
        } else {
          let swal = {
            icon: data.tipo,
            title: data.titulo,
            text: data.mensaje,
          };
          this._swalService.show(swal).then((res) => {
            if (res.isConfirmed) this.router.navigate(['/inventario/inventario-fisico']);
          });
        }

        this.Cargando = false;
      });
  }

  ListarProductosSinDiferencia() {
    this.Inventario_Sin_Diferencia;
    localStorage.setItem(
      'Productos_Sin_Diferencia',
      this._generalService.normalize(JSON.stringify(this.Inventario_Sin_Diferencia)),
    );
  }

  guardarLocalStg() {
    localStorage.setItem(
      'Productos_Diferencia',
      this._generalService.normalize(JSON.stringify(this.Inventario_Diferencial)),
    );
  }

  guardarInventarioFinal() {
    let listado = JSON.stringify(this.Inventario_Diferencial);
    let datos = new FormData();
    datos.append('listado_inventario', listado);
    datos.append('id_funcionario', this.Funcionario_Autoriza);
    datos.append('inventarios', this.Inventarios);

    const request = (resolve: any) => {
      this.inventariofisico.SaveReconteoAuditor(datos).subscribe({
        next: (data: any) => {
          if (data.tipo == 'success') {
            let swal = {
              icon: data.tipo,
              title: data.titulo,
              text: data.mensaje,
            };
            this._swalService.show(swal).then((res) => {
              if (res.isConfirmed) this.router.navigate(['/inventario/inventario-fisico']);
            });

            this.Inventario_Diferencial = [];
            this.Inventario_Sin_Diferencia = [];
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
    this._swalService.swalLoading('Vamos a registrar el inventario final', request);
  }

  VerPantallaLista() {
    this.router.navigate(['/ajusteinventariofisico']);
  }

  DecargarInforme() {
    let data = new FormData();
    let info = JSON.stringify(this.Inventario_Diferencial);
    console.log(info);

    data.append('productos', info);

    var form = document.createElement('form');
    form.target = '_blank';
    form.method = 'POST';
    form.action = environment.ruta + 'php/inventariofisico/estiba/descargar_excel_diferencias.php';
    form.style.display = 'none';
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'producto';
    input.value = info;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}


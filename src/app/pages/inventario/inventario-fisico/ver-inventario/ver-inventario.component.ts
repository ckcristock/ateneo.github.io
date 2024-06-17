import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgIf, NgFor, NgClass, DecimalPipe } from '@angular/common';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { InventariofisicoService } from '@app/core/services/inventariofisico.service';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';

@Component({
  selector: 'app-ver-inventario',
  templateUrl: './ver-inventario.component.html',
  styleUrls: ['./ver-inventario.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, TableComponent, CabeceraComponent, DecimalPipe],
})
export class VerInventarioComponent implements OnInit {
  inventario: any = [];
  id_inventario;
  fecha_realizado;
  public loading: boolean = false;
  datosCabecera: any = {
    Codigo: '',
    CodigoFormato: '',
    Titulo: 'Ver inventario físico',
    Fecha: '',
  };
  inventoryId: string = '';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private inventarioFisicoService: InventariofisicoService,
    private _swalService: SwalService,
  ) {}

  ngOnInit() {
    this.getInventory();
  }
  getInventory() {
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.inventoryId = params['inventoryId'];
    });
    this.inventarioFisicoService.getInventarioFisicoTerminado(this.inventoryId).subscribe({
      next: async (res: any) => {
        if (res.Tipo == 'success') {
          this.inventario = res.Inventario;
          this.datosCabecera = {
            Titulo: 'Ver inventario físico',
            Fecha: res.Inventario[0].Fecha_Realizado,
            Codigo: res.Inventario[0].Codigo,
            CodigoFormato: res.Inventario[0].Nombre_Grupo,
          };
        } else {
          let swal = {
            icon: res.Tipo,
            title: res.Titulo,
            text: res.Texto,
            showCancel: false,
          };
          this._swalService.show(swal);
        }
        this.loading = false;
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

  ///////// borrar
  // getfecha_realizado() {
  //   this.id_inventario = this.route.snapshot.params['idInventario'];
  //   this.loading = true;
  //   this.getInventarioFisicoTerminado(this.id_inventario).subscribe((res: any) => {
  //     if (res.Tipo == 'success') {
  //       this.inventario = res.Inventario;
  //       this.fecha_realizado = res.Inventario[0]['Fecha_Realizado'];
  //       this.grupo = res.Inventario[0]['Nombre_Grupo'];
  //     }
  //     this.loading = false;
  //   });
  // }

  getInventarioFisicoTerminado(p: string) {
    return this.http.get(
      environment.base_url +
        '/php/inventariofisico/estiba/ver_inventario_terminado.php?Id_Inventario_Fisico_Nuevo=' +
        p,
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraNacionalService } from '../compra-nacional.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { UserService } from 'src/app/core/services/user.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { ListItemsComponent } from '../../../../components/list-items/list-items.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';
import { NgIf, NgFor, UpperCasePipe, DecimalPipe, TitleCasePipe, DatePipe } from '@angular/common';
import { PlaceholderFormComponent } from '../../../../components/placeholder-form/placeholder-form.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
@Component({
  selector: 'app-ver-compra-nacional',
  templateUrl: './ver-compra-nacional.component.html',
  styleUrls: ['./ver-compra-nacional.component.scss'],
  standalone: true,
  imports: [
    PlaceholderFormComponent,
    NgIf,
    NgFor,
    CabeceraComponent,
    TableComponent,
    ListItemsComponent,
    UpperCasePipe,
    DecimalPipe,
    TitleCasePipe,
    DatePipe,
    StatusBadgeComponent,
  ],
})
export class VerCompraNacionalComponent implements OnInit {
  activities: any[] = [];
  Compra: any[] = [];
  Lista_Rechazo: any[] = [];
  datosCabecera: any = {};
  loading: boolean;
  id: any;
  user_id = this._user.user.id;
  permission: Permissions = {
    menu: 'Órdenes de compra',
    permissions: {
      show: true,
      approve: true,
    },
  };

  constructor(
    private route: ActivatedRoute,
    private _user: UserService,
    private _permission: PermissionService,
    private _swal: SwalService,
    private _compras: CompraNacionalService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
    console.log('this.permission ', this.permission);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.getTipoRechazo();
      this.getData();
    });
  }

  getTipoRechazo() {
    this._compras.getTipoRechazo().subscribe((res: any) => {
      res.data.forEach((value) => {
        this.Lista_Rechazo[value.Id_Tipo_Rechazo] = value.Nombre;
      });
    });
  }

  getData() {
    this.loading = true;
    let params = {
      id: this.id,
    };
    this._compras.getDatosComprasNacionales(params).subscribe((res: any) => {
      this.Compra = res.data;
      console.log('this.Compra', this.Compra);

      this.activities = res.data.activity;
      this.datosCabecera = {
        Fecha: res.data.created_at,
        Codigo: res.data.Codigo,
        Titulo: res.data.Estado,
        CodigoFormato: res.data.format_code,
      };
      this.loading = false;
    });
  }

  downloading: boolean;

  download(id) {
    this.downloading = true;
    this._compras.download(id).subscribe(
      (response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/pdf' });
        let link = document.createElement('a');
        const filename = 'orden-compra' + id;
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        this.downloading = false;
      },
      (error) => {
        this.downloading = false;
        this._swal.hardError();
      },
      () => {
        this.downloading = false;
      },
    );
  }

  async EstadoAprobacion(Estado) {
    const MENSAJE_ACCION = {
      Anulada: 'anular',
      Pendiente: 'activar',
      Aprobada: 'aprobar',
    };
    let rejected: any;
    const request = () => {
      let datos = {
        id: this.id,
        estado: Estado,
        funcionario: this.user_id,
        motivo: rejected ?? '',
      };
      this._compras.setEstadoCompra(datos).subscribe((res: any) => {
        this._swal.show({
          icon: res.data.tipo,
          title: res.data.titulo,
          text: res.data.mensaje,
          timer: 1000,
          showCancel: false,
        });
        this.ngOnInit();
      });
    };
    if (Estado === 'Rechazada') {
      this._swal
        .customAlert({
          text: 'Vamos a rechazar la orden de compra, selecciona un motivo.',
          icon: 'question',
          input: 'select',
          inputOptions: this.Lista_Rechazo,
          inputPlaceholder: 'Selecciona',
          showCancelButton: true,
          confirmButtonText: 'Rechazar',
          cancelButtonText: 'Cancelar',
        })
        .then((res) => {
          rejected = res.value;
          if (res.isConfirmed) {
            this._swal.swalLoading('', request);
          }
        });
      return;
    }
    this._swal.swalLoading(
      'Vamos a ' +
        MENSAJE_ACCION[Estado] +
        ' la orden de compra' +
        (Estado == 'Aprobada' ? ' para proceder a solicitarla' : ''),
      request,
    );
  }
}

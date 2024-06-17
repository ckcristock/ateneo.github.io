import {
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavContent,
  NgbPopover,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetalleService } from './detalle.service';
import { environment } from 'src/environments/environment';
import { UntypedFormGroup } from '@angular/forms';
import { UserDetail } from './interfaces/detalle.interface';
import { Subscription } from 'rxjs';
import { PermissionsComponent } from './permissions/permissions.component';
import { AfiliacionesComponent } from './ver-funcionario/afiliaciones/afiliaciones.component';
import { SalarioComponent } from './ver-funcionario/salario/salario.component';
import { DatosEmpresaComponent } from './ver-funcionario/datos-empresa/datos-empresa.component';
import { DatosBasicosComponent } from './ver-funcionario/datos-basicos/datos-basicos.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { ModalPreliquidarComponent } from '@app/components/modal-preliquidar/modal-preliquidar.component';
import { SwalService } from '../../services/swal.service';
import { SafePipe } from '@app/core/pipes/safe.pipe';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-detalle-funcionario',
  templateUrl: './detalle-funcionario.component.html',
  styleUrls: ['./detalle-funcionario.component.scss'],
  standalone: true,
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    LoadImageComponent,
    DatosBasicosComponent,
    NgbPopover,
    DatosEmpresaComponent,
    SalarioComponent,
    AfiliacionesComponent,
    PermissionsComponent,
    NgbNavOutlet,
    ModalPreliquidarComponent,
    SafePipe,
    RouterLink,
  ],
})
export class DetalleFuncionarioComponent implements OnInit {
  private subscriber: Subscription = new Subscription();
  userDetail: Partial<UserDetail> = {};
  loadings: Record<string, boolean> = {
    basic_data: true,
    company: true,
    salary: true,
    affiliation: true,
  };
  downloading: boolean;
  components = 'informacion';
  active = 1;
  responsable: any = {};
  form: UntypedFormGroup;

  user!: number;
  public ruta = environment.url_assets;
  public url: string;

  constructor(
    private detalleService: DetalleService,
    private activateRoute: ActivatedRoute,
    private _swal: SwalService,
    private userService: UserService,
  ) {
    this.user = Number(userService.user.id);
  }

  ngOnInit(): void {
    this.getAllUserInfo();
    this.handleRoute();
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  private handleRoute() {
    const route = this.activateRoute.snapshot.params.route;
    if (route === 'permit') this.active = 2;
    else if (route === 'doc') this.active = 3;
    else this.active = 1;
  }

  restorePassword() {
    const request = () => {
      this.userService.restorePassword(this.id).subscribe({
        next: (res: any) => {
          this._swal.show({
            icon: 'success',
            title: 'Operación exitosa',
            text: res.data,
          });
        },
        error: () => {
          this._swal.hardError();
        },
      });
    };
    this._swal.swalLoading('Permitir que el funcionario ingrese una nueva contraseña', request);
  }

  getAllUserInfo(loadingType?: string): void {
    this.loadings[loadingType] = true;
    this.subscriber = this.detalleService.getAllUserInfo(this.id).subscribe({
      next: (res) => {
        this.userDetail = res.data;
        this.loadings = {
          basic_data: false,
          company: false,
          salary: false,
          affiliation: false,
        };
        this.url =
          this.ruta +
          '/filemanager4/filemanager/dialog.php?type=0&car=rrhh%2Ffuncionarios%2F' +
          this.userDetail.identifier;
      },
      error: () => {
        this.loadings = {
          basic_data: false,
          company: false,
          salary: false,
          affiliation: false,
        };
      },
    });
  }

  recargarDatos() {
    this.getBasicData();
  }

  bloquear(state: any) {
    let data = {
      state,
      responsible: this.responsable,
    };
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text:
          data.state == 'Inactivo'
            ? 'Vamos a bloquear a ' + this.userDetail.first_name + '.'
            : 'Vamos a activar a ' + this.userDetail.first_name + '.',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.detalleService.blockUser(data, this.id).subscribe((r: any) => {
            // this.getUser();
            this._swal.show({
              icon: 'success',
              title: 'Proceso finalizado',
              text:
                data.state == 'Inactivo'
                  ? this.userDetail.first_name + ' ha sido bloqueado con éxito.'
                  : this.userDetail.first_name + ' ha sido activado con éxito.',
              showCancel: false,
              timer: 1000,
            });
          });
        }
      });
  }

  getBasicData() {
    this.detalleService.getBasicData(this.id).subscribe((res: any) => {
      this.userDetail = res.data;
      this.url =
        this.ruta +
        '/filemanager4/filemanager/dialog.php?type=0&car=rrhh%2Ffuncionarios%2F' +
        this.userDetail.identifier;
    });
  }

  downloadPreliquidation() {
    this.downloading = true;
    this.detalleService.downloadLiquidationPdf(this.id).subscribe({
      next: (res: any) => {
        const file = new Blob([res], { type: 'application/pdf' });
        const link = document.createElement('a');
        const modifiedFullNames = this.userDetail.full_names.toLowerCase().replace(/\s+/g, '-');
        link.href = window.URL.createObjectURL(file);
        const fileName = `liquidacion-${modifiedFullNames}`;
        link.download = `${fileName}.pdf`;
        link.click();
        this.downloading = false;
      },
      error: () => {
        this._swal.hardError();
        this.downloading = false;
      },
      complete: () => {
        this.downloading = false;
      },
    });
  }

  get id(): number {
    return this.activateRoute.snapshot.params.id;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Location, NgIf, NgFor, NgClass, UpperCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { PlanCuentasService } from './plan-cuentas.service';
import swal from 'sweetalert2';
import { UserService } from 'src/app/core/services/user.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { consts } from 'src/app/core/utils/consts';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ImportInitialBalancesComponent } from './import-initial-balances/import-initial-balances.component';
import { ImportPucComponent } from './import-puc/import-puc.component';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-plan-cuentas',
  templateUrl: './plan-cuentas.component.html',
  styleUrls: ['./plan-cuentas.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    NgIf,
    NgFor,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    ImportPucComponent,
    ImportInitialBalancesComponent,
    NotDataComponent,
    UpperCasePipe,
  ],
})
export class PlanCuentasComponent implements OnInit {
  plans: any[] = [];
  loading: boolean = false;
  banks: any[] = [];
  //Paginación
  public maxSize = 5;
  public pageSize = 20;
  public TotalItems: number;
  public page = 1;
  masks = consts;

  //Variables para filtros
  public filtro_codigo: any = '';
  public filtro_nombre: any = '';
  public filtro_codigo_niif: any = '';
  public filtro_nombre_niif: any = '';
  public filtro_estado_cuenta: any = 'ACTIVO';
  public filtro_empresa: any = '';
  public company_id: any;
  public PlanCuentaModel: any = {
    Id_Plan_Cuenta: '',
    Tipo_P: '',
    Tipo_Niif: '',
    Codigo: '',
    Nombre: '',
    Codigo_Niif: '',
    Nombre_Niif: '',
    Estado: 'ACTIVO',
    Ajuste_Contable: '',
    Cierra_Terceros: '',
    Movimiento: '',
    Documento: '',
    Base: '',
    Valor: '',
    Porcentaje: '',
    Centro: '',
    Centro_Costo: '',
    Depreciacion: '',
    Amortizacon: '',
    Exogeno: '',
    Naturaleza: '',
    Maneja_Nit: '',
    Banco: '',
    Cod_Banco: '',
    Cie_Anual: '',
    Nit_Cierre: '',
    Nit: '',
    Clase_Cta: '',
    Cta_Numero: '',
    Reporte: '',
    company_id: '',
  };

  permission: Permissions = {
    menu: 'Plan cuentas',
    permissions: {
      show: true,
    },
  };

  plan2: any[] = [];

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private swalService: SwalService,
    private _planCuentas: PlanCuentasService,
    private _user: UserService,
    private _modal: ModalService,
  ) {
    this.company_id = this._user.user.person.company_worked.id;
  }

  ngOnInit() {
    this.RecargarDatos();
    this.ListarBancos();
    this.getPlanCuentas();
  }

  getPlanCuentas() {
    this._planCuentas.paginate2().subscribe((res: any) => {
      this.plan2 = res.data;
    });
  }

  importCommercialPuc() {
    this.swalService.show2(
      {
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a eliminar todo y remplazar por el PUC comercial existente',
      },
      {
        preConfirm: (value) => {
          return new Promise((resolve) => {
            this._planCuentas.importCommercialPuc().subscribe((res: any) => {
              this.swalService.show(
                {
                  icon: res.data.original.icon,
                  title: res.data.original.title,
                  text: res.data.original.text,
                  showCancel: false,
                  timer: res.data.original.timer,
                },
                true,
              );
              this.RecargarDatos();
            });
          });
        },
      },
    );
  }

  RecargarDatos() {
    let urlParams = this.route.snapshot.queryParams;
    if (Object.keys(urlParams).length > 0) {
      this.AsignarParametrosUrl(urlParams);
      this.filtros(this.page > 1);
    } else {
      this.filtros();
    }
  }

  //Setear filtros
  SetFiltros(paginacion: boolean = false) {
    let params: any = {};
    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1;
      params.pag = this.page;
    }
    if (this.filtro_codigo != '') {
      params.cod = this.filtro_codigo;
    }
    if (this.filtro_codigo_niif != '') {
      params.cod_niif = this.filtro_codigo_niif;
    }
    if (this.filtro_nombre != '') {
      params.nombre = this.filtro_nombre;
    }
    if (this.filtro_nombre_niif != '') {
      params.nombre_niif = this.filtro_nombre_niif;
    }
    if (this.filtro_estado_cuenta != '') {
      params.estado = this.filtro_estado_cuenta;
    }
    params.company_id = this._user.user.person.company_worked.id;

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    return queryString;
  }

  //Aplicar filtros en la tabla
  filtros(paginacion: boolean = false) {
    this.loading = true;
    var param2 = {
      ...this.filtros,
      pag: this.page,
      company_id: this._user.user.person.company_worked.id,
    };
    let params = this.SetFiltros(paginacion);

    this.location.replaceState('/contabilidad/plan-cuentas', params);
    this._planCuentas.getPlanCuentas(params).subscribe((data: any) => {
      this.plans = data.query_result;
      this.TotalItems = data.numReg;
      this.loading = false;
    });
  }

  openInNewTab() {
    this._planCuentas.descargarExcel(this.company_id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = 'PUC';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
    });
  }

  AsignarParametrosUrl(urlParams: any) {
    this.page = urlParams.pag ? urlParams.pag : 1;
    this.filtro_codigo_niif = urlParams.cod_niif ? urlParams.cod_niif : '';
    this.filtro_codigo = urlParams.cod ? urlParams.cod : '';
    this.filtro_nombre = urlParams.nombre ? urlParams.nombre : '';
    this.filtro_nombre_niif = urlParams.nombre_niif ? urlParams.nombre_niif : '';
    this.filtro_estado_cuenta = urlParams.estado ? urlParams.estado : '';
  }

  ListarBancos() {
    this._planCuentas.listarBancos().subscribe((data: any) => {
      this.banks = data;
    });
  }

  habInfoValue(value) {
    if (value == 'S') {
      (document.getElementById('Valor') as HTMLInputElement).disabled = false;
      (document.getElementById('Porcentaje') as HTMLInputElement).disabled = false;
    } else {
      (document.getElementById('Valor') as HTMLInputElement).disabled = true;
      (document.getElementById('Porcentaje') as HTMLInputElement).disabled = true;
    }
  }
  habInfoValue2(value) {
    if (value == 'S') {
      (document.getElementById('Valor_Editar') as HTMLInputElement).disabled = false;
      (document.getElementById('Porcentaje_Editar') as HTMLInputElement).disabled = false;
    } else {
      (document.getElementById('Valor_Editar') as HTMLInputElement).disabled = true;
      (document.getElementById('Porcentaje_Editar') as HTMLInputElement).disabled = true;
    }
  }

  habBancos(value) {
    if (value == 'S') {
      (document.getElementById('Cod_Banco') as HTMLInputElement).disabled = false;
      (document.getElementById('Cod_Banco') as HTMLInputElement).value = '';
    } else {
      (document.getElementById('Cod_Banco') as HTMLInputElement).disabled = true;
      (document.getElementById('Cod_Banco') as HTMLInputElement).value = '';
    }
  }
  habBancos2(value) {
    if (value == 'S') {
      (document.getElementById('Cod_Banco_Editar') as HTMLInputElement).disabled = false;
      (document.getElementById('Cod_Banco_Editar') as HTMLInputElement).value = '';
    } else {
      (document.getElementById('Cod_Banco_Editar') as HTMLInputElement).disabled = true;
      (document.getElementById('Cod_Banco_Editar') as HTMLInputElement).value = '';
    }
  }
  openModal(content) {
    this._modal.openScrollableContent(content);
  }

  habCampos(value) {
    this.PlanCuentaModel = value.query_result;
    if (typeof value == 'object') {
      if (value.query_result.Movimiento == 'S') {
        $('.input').prop('disabled', false);
      } else {
        $('.input').prop('disabled', true);
      }
    } else {
      if (value == 'S') {
        $('.input').val('').prop('disabled', false);
      } else {
        $('.input').val('N').prop('disabled', true);
      }
    }
  }

  guardarPlan(Formulario: NgForm, accion: string) {
    this.swalService
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Revisa la información',
      })
      .then((r) => {
        if (r.isConfirmed) {
          let datos = new FormData();
          const token = this._user.token;
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          if (accion == 'guardar') {
            let info = JSON.stringify(Formulario.value);
            datos.append('Datos', info);
          } else if (accion == 'editar') {
            let info = JSON.stringify(this.PlanCuentaModel);
            datos.append('Datos', info);
          }
          /* this._planCuentas.guardarPlan(datos) */
          this.http
            .post(environment.base_url + '/php/contabilidad/plancuentas/guardar_puc.php', datos, {
              headers,
            })
            .subscribe((data: any) => {
              let title = data.tipo == 'error' ? 'Error' : 'Exito';
              this.swalService.show({
                icon: data.tipo,
                title: title,
                text: data.mensaje,
                timer: 1000,
              });
              this._modal.close();

              this.filtros();
            });
        }
      });
  }

  EditarPlanCuenta(idPlanCuenta, content) {
    let params = {
      id_cuenta: idPlanCuenta,
    };
    this._planCuentas.obtenerPlan(params).subscribe((data: any) => {
      this.openModal(content);
      this.habCampos(data);
    });
  }

  VerPlanCuenta(idPlanCuenta, content) {
    let params = {
      id_cuenta: idPlanCuenta,
    };
    this._planCuentas.obtenerPlan(params).subscribe((data: any) => {
      this.PlanCuentaModel = data.query_result;
      this._modal.open(content);
    });
  }

  CambiarEstadoPlan(idPlanCuenta) {
    this.swalService
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a cambiar el estado de la cuenta contable',
      })
      .then((r) => {
        if (r.isConfirmed) {
          let datos = new FormData();
          datos.append('id_cuenta', idPlanCuenta);
          this.http
            .post(environment.base_url + '/php/contabilidad/plancuentas/cambiar_estado.php', datos)
            .subscribe((data: any) => {
              this.swalService.show({
                icon: data.icon,
                title: data.title,
                text: data.msg,
                showCancel: false,
                timer: 1000,
              });
              this.filtros();
            });
        }
      });
  }

  lengthByType(tipo) {
    let tipos = {
      clase: 1,
      grupo: 2,
      cuenta: 4,
      subcuenta: 6,
      auxiliar: 8,
    };
    return tipos[tipo];
  }

  TransformarValor(value) {
    if (value == 'N' || value == '' || value === null) {
      return 'NO';
    } else {
      return 'SI';
    }
  }

  Tipo_Niif;
  Tipo_Niif_Editar;
  Codigo_Padre;
  validarPUC(campo, tipo_puc, editar = false) {
    let codigo: string = campo.target.value;
    let id_campo = campo.target.id;
    let tipo_plan = '';
    tipo_plan = !editar ? this.Tipo_Niif.toLowerCase() : this.Tipo_Niif_Editar.toLowerCase();

    if (tipo_plan != '') {
      if (codigo.length != this.lengthByType(tipo_plan)) {
        this.swalService.show({
          icon: 'error',
          title: 'Error',
          text: `El código no corresponde al tipo de plan "${tipo_plan}".`,
          showCancel: false,
        });
      } else if (tipo_plan != 'grupo') {
        let p: any = {
          Tipo_Plan: tipo_plan,
          Codigo: codigo,
          Tipo_Puc: tipo_puc,
        };
        this._planCuentas.validarNiveles(p).subscribe((data: any) => {
          if (data.validacion == 0) {
            swal.fire({
              icon: 'error',
              title: 'Ooops!',
              text: `El código ${codigo} no pertenece al nivel superior "${data.nivel_superior}"`,
            });
          } else {
            this.Codigo_Padre =
              codigo.length === 1
                ? 'No aplica'
                : codigo.length === 2
                  ? codigo.slice(0, -1)
                  : codigo.slice(0, -2);
          }
        });
      } else {
        this.Codigo_Padre =
          codigo.length === 1
            ? 'No aplica'
            : codigo.length === 2
              ? codigo.slice(0, -1)
              : codigo.slice(0, -2);
      }
    }
  }

  showAlert(tipo, titulo, mensaje) {
    let swal = {
      icon: tipo,
      titulo: titulo,
      mensaje: mensaje,
    };
    this.swalService.ShowMessage(swal);

    return;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { TypeName, getAccepts, getTypes, loadFile } from '@shared/functions/load-file';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { ChangePaymentMethodComponent } from './components/change-payment-method/change-payment-method.component';
import { HeaderComponent } from '@shared/components/standard-components/header/header.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { DatosBasicosEmpresaComponent } from './components/datos-basicos-empresa/datos-basicos-empresa.component';
import { DatosPilaComponent } from './components/datos-pila/datos-pila.component';
import { DatosNominaComponent } from './components/datos-nomina/datos-nomina.component';
import { DatosPagoComponent } from './components/datos-pago/datos-pago.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { SubcategoriasComponent } from './components/subcategorias/subcategorias.component';
import { HistorialDatosComponent } from './components/historial-datos/historial-datos.component';
import { SedesComponent } from './components/sedes/sedes.component';
import { EstructuraEmpresaComponent } from './components/structure-company/estructura-empresa.component';
import { CuentasBancariasComponent } from '../../../parametros/cuentas-bancarias/cuentas-bancarias.component';
import { ConfiguracionEmpresaService } from './configuracion-empresa.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-company-configuration',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    HeaderButtonComponent,
    NgbNavModule,
    DatosBasicosEmpresaComponent,
    DatosPilaComponent,
    DatosNominaComponent,
    DatosPagoComponent,
    EstructuraEmpresaComponent,
    CuentasBancariasComponent,
    CategoriasComponent,
    SubcategoriasComponent,
    SedesComponent,
    HistorialDatosComponent,
  ],
  templateUrl: './company-configuration.component.html',
  styleUrl: './company-configuration.component.scss',
})
export class CompanyConfigurationComponent implements OnInit {
  permission: Permissions = {
    menu: 'Empresas',
    permissions: {
      show: true,
      all_companies: true,
    },
  };

  nameNav = {
    informacion: 1,
    estructura: 2,
    'cuentas-bancarias': 3,
    categorias: 4,
    sedes: 5,
    historial: 6,
  };

  companyDetails!: Record<string, any>;

  readonly permitFiles: TypeName[] = ['png', 'jpeg', 'jpg'];

  fileAccepts = getAccepts(this.permitFiles);

  fileTypes = getTypes(this.permitFiles);

  companyId = 0;

  activeNav = 1;

  loading = true;

  constructor(
    private readonly companyConfigurationService: ConfiguracionEmpresaService,
    private readonly swalService: SwalService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modalService: NgbModal,
  ) {
    this.companyId = activatedRoute.snapshot.params.id;
    this.activeNav = this.nameNav[activatedRoute.snapshot.params.value] ?? 1;
  }

  ngOnInit(): void {
    if (!this.permission.permissions.show) {
      this.router.navigate(['/notautorized']);
      return;
    }
    this.getCompanyData();
  }

  private getCompanyData(): void {
    this.companyConfigurationService.getCompanyData(this.companyId).subscribe({
      next: (res: any) => {
        this.companyDetails = res.data;
        this.loading = false;
      },
    });
  }

  private saveCompanyData(file: ArrayBuffer): void {
    this.companyConfigurationService
      .saveCompanyData({
        id: this.companyId,
        page_heading: file,
      })
      .subscribe({
        next: () => {
          this.swalService.show({
            icon: 'success',
            title: 'Hoja cargada con éxito',
            showCancel: false,
            text: '',
            timer: 3000,
          });
          this.companyDetails['page_heading'] = true;
        },
      });
  }

  getDataCompany() {
    this.getCompanyData();
  }

  openChangePaymentMethod(): void {
    const modalRef = this.modalService.open(ChangePaymentMethodComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.companyId = this.companyId;
  }

  openMemorandumsByOfficer(): void {
    const modalRef = this.modalService.open(ConfigurationComponent, {
      size: 'lg',
      centered: true,
    });
    if (!this.companyDetails.company_configuration)
      this.companyDetails.company_configuration = {
        company_id: this.companyId,
      };
    modalRef.componentInstance.data = this.companyDetails.company_configuration;
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'updateCompany') this.getCompanyData();
      },
    });
  }

  onFileChanged(event): void {
    const file = event.target.files[0];
    loadFile(file, this.fileTypes)
      .then((res) => {
        this.saveCompanyData(res.file);
      })
      .catch(() => {
        this.swalService.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
      });
  }
}

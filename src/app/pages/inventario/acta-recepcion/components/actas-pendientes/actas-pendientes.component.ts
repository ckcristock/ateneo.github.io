import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { RouterModule } from '@angular/router';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActaRecepcionService } from '../../acta-recepcion.service';
import { ModalService } from '@app/core/services/modal.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { functionsUtils } from '@app/core/utils/functionsUtils';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { skipContentType } from '@app/http.context';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-actas-pendientes',
  standalone: true,
  imports: [
    CardComponent,
    TableComponent,
    LoadImageComponent,
    RouterModule,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionDeactivateComponent,
    DatePipe,
    UpperCasePipe,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './actas-pendientes.component.html',
  styleUrl: './actas-pendientes.component.scss',
})
export class ActasPendientesComponent implements OnInit {
  @Input() companyWorkedId!: any;
  actas_pendientes = [];
  public Cargando3: boolean = false;
  public alertOption: SweetAlertOptions = {};
  public Causales = [];

  public Model: any = {
    Id_Acta_Recepcion: '',
    Id_Causal_Anulacion: '',
    Observaciones: '',
    Identificacion_Funcionario: '1',
  };

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  constructor(
    private actaRecepcionService: ActaRecepcionService,
    private _modal: ModalService,
    private _swalService: SwalService,
    private http: HttpClient,
  ) {
    this.alertOption = {
      title: '¿Estás seguro(a)?',
      text: 'Vamos a anular el acta de recepción, esta acción es irreversible.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: this._swalService.buttonColor.confirm,
      cancelButtonColor: this._swalService.buttonColor.cancel,
      confirmButtonText: '¡Sí, confirmar!',
      showLoaderOnConfirm: true,
      focusCancel: true,
      reverseButtons: true,
      icon: 'question',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.AnularActa();
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    };
  }

  onCancelAlert() {
    this._swalService.customAlert(this.alertOption);
  }
  ngOnInit(): void {
    this.getActasPendientes();
    this.getCausalesAnulacion();
  }

  getCausalesAnulacion() {
    this.actaRecepcionService.getCausalesAnulacion().subscribe((res: any) => {
      this.Causales = res.data;
    });
  }

  getActasPendientes() {
    this.Cargando3 = true;
    let params = {
      company_id: this.companyWorkedId,
      ...this.pagination,
    };
    this.actaRecepcionService.getActaRecepcion(params).subscribe((res: any) => {
      this.actas_pendientes = res.data.data;
      this.pagination.length = res.data.total;
      this.Cargando3 = false;
    });
  }

  AsignarDatos(id, content) {
    this.Model.Id_Acta_Recepcion = id;
    this._modal.open(content);
  }

  AnularActa() {
    let modelo = functionsUtils.normalize(JSON.stringify(this.Model));
    let data = new FormData();
    data.append('modelo', modelo);
    this.http
      .post(environment.base_url + '/php/actarecepcion/anular_acta.php', data, {
        context: skipContentType(),
      })
      .subscribe((data: any) => {
        if (data.tipo == 'success') {
          this.Model = {
            Id_Acta_Recepcion: '',
            Id_Causal_Anulacion: '',
            Observaciones: '',
            Identificacion_Funcionario: '1',
          };

          this._swalService.show({ ...data, showCancel: false });
        } else {
          this._swalService.show({ ...data, showCancel: false });
        }
        this._modal.close();
        this.getActasPendientes();
        //this.getActasAnuladas();
      });
  }
}

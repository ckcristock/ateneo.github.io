import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { DatePipe, NgFor, UpperCasePipe } from '@angular/common';
import { CompraNacionalService } from './compra-nacional.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ModalBasicComponent } from '../../../components/modal-basic/modal-basic.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionButtonComponent } from '../../../shared/components/standard-components/action-button/action-button.component';
import { ActionViewComponent } from '../../../shared/components/standard-components/action-view/action-view.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { RouterLink } from '@angular/router';
import { AddButtonComponent } from '../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-compra-nacional',
  templateUrl: './compra-nacional.component.html',
  styleUrls: ['./compra-nacional.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    RouterLink,
    TableComponent,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionButtonComponent,
    ActionDeactivateComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    ModalBasicComponent,
    NotDataComponent,
    CapitalLetterPipe,
    DatePipe,
    UpperCasePipe,
  ],
})
export class CompraNacionalComponent implements OnInit {
  @ViewChild('infoSwal') infoSwal: any;
  datePipe = new DatePipe('es-CO');
  date: { year: number; month: number };
  loading: boolean = false;
  comprasnacionales: any[] = [];
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  estadosCompra: any[] = [];
  dias_anulacion: any = '';
  funcionario_anulacion: any = '';
  funcionarios_anulacion: any = [];
  precompra: any[];
  filtros: any = {
    cod: '',
    est: '',
    prov: '',
    startDate: '',
    endDate: '',
    func: '',
  };
  requiredParams: any = { params: { tipo: 'todo', funcionario: 1, company_id: '' } };

  constructor(
    private http: HttpClient,
    private _user: UserService,
    private _compraNacional: CompraNacionalService,
    private _swal: SwalService,
  ) {}

  ngOnInit() {
    this.requiredParams.params.company_id = this._user.user.person.company_worked.id;
    this.getEstadoscompra();
    this.listarComprasNacionales();
    this.getDiasAnulacion();
    this.getFuncioriosParaResponsables();
  }

  downloading: boolean;
  download(id) {
    this.downloading = true;
    this._compraNacional.download(id).subscribe(
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

  selectedDate() {
    if (this.filtros.endDate && this.filtros.startDate) {
      this.filtros.startDate = this.datePipe.transform(this.filtros.startDate, 'yyyy-MM-dd');
      this.filtros.endDate = this.datePipe.transform(this.filtros.endDate, 'yyyy-MM-dd');
      this.listarComprasNacionales();
    }
  }

  listarComprasNacionales() {
    if (this.filtros.endDate) {
      this.filtros.startDate = this.datePipe.transform(this.filtros.startDate, 'yyyy-MM-dd');
      this.filtros.endDate = this.datePipe.transform(this.filtros.endDate, 'yyyy-MM-dd');
    }
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.filtros,
      ...this.requiredParams.params,
    };
    this._compraNacional.getListaComprasNacionales(params).subscribe((res: any) => {
      this.comprasnacionales = res.data.data;
      this.loading = false;
      this.pagination.length = res.data.total;
    });
  }

  getEstadoscompra() {
    this._compraNacional.getEstadosCompra().subscribe((res: any) => {
      this.estadosCompra = res.data;
    });
  }

  setEstadoCompra(id, estado) {
    const MENSAJE_ACCION = {
      Anulada: 'anular',
      Pendiente: 'activar',
    };
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a ' + MENSAJE_ACCION[estado] + ' la orden de compra.',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let datos = {
            id: id,
            funcionario: this._user.user.id,
            estado: estado,
            motivo: '',
          };
          this._compraNacional.setEstadoCompra(datos).subscribe((res: any) => {
            this._swal.show({
              icon: res.data.tipo,
              title: res.data.titulo,
              text: res.data.mensaje,
              timer: 1000,
              showCancel: false,
            });
            this.listarComprasNacionales();
          });
        }
      });
  }

  getDiasAnulacion() {
    this.http
      .get(environment.ruta + 'php/comprasnacionales/get_dias_anulacion.php')
      .subscribe((data: any) => {
        this.dias_anulacion = data['Dias_Anulacion'];
        this.funcionario_anulacion = data['Funcionario_Anulacion'];
      });
  }

  getFuncioriosParaResponsables() {
    this.http
      .get(environment.base_url + '/php/funcionarios/lista_funcionarios?depen=admin')
      .subscribe((res: any) => {
        this.funcionarios_anulacion = res.data;
      });
  }

  setDiasAnulacion() {
    if (this.dias_anulacion <= 0) {
      this.infoSwal.type = 'error';
      this.infoSwal.title = '¡Ha ocurrido un error!';
      this.infoSwal.text = 'El valor no puede ser menor a 1';
      this.infoSwal.show();
      return false;
    }

    let params: any = {};
    params.Dias_Anulacion = this.dias_anulacion;
    params.Funcionario_Anulacion = this.funcionario_anulacion;

    this.http
      .get(environment.ruta + '/php/comprasnacionales/set_dias_anulacion.php', { params: params })
      .subscribe((data: any) => {
        this.infoSwal.type = data.type;
        this.infoSwal.title = data.title;
        this.infoSwal.text = data.message;
        this.infoSwal.show();
      });
  }
}

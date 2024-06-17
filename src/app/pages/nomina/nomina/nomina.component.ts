import { DatePipe, NgIf, NgFor, DecimalPipe, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import moment from 'moment';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { PayRollService } from './pay-roll.service';
import { ImagePipe } from '../../../core/pipes/image.pipe';
import { ModalDeduccionesComponent } from './modals/modal-deducciones/modal-deducciones.component';
import { ModalIngresosNoPrestacionalesComponent } from './modals/modal-ingresos-no-prestacionales/modal-ingresos-no-prestacionales.component';
import { ModalIngresosPrestacionalesComponent } from './modals/modal-ingresos-prestacionales/modal-ingresos-prestacionales.component';
import { ModalNovedadesComponent } from './modals/modal-novedades/modal-novedades.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { AutocompleteMdlComponent } from '../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { CardConceptoComponent } from './card-concepto/card-concepto.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { GlobalService } from '@shared/services/global.service';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HorasExtrasComponent } from './modals/horas-extras/horas-extras.component';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    CardConceptoComponent,
    AutocompleteMdlComponent,
    FormsModule,
    MatOptionModule,
    NgFor,
    RouterLink,
    NotDataComponent,
    ModalNovedadesComponent,
    ModalIngresosPrestacionalesComponent,
    ModalIngresosNoPrestacionalesComponent,
    ModalDeduccionesComponent,
    DecimalPipe,
    ImagePipe,
    StandardModule,
    LoadImageComponent,
    AsyncPipe,
  ],
})
export class NominaComponent implements OnInit {
  nomina: any = {
    frecuencia_pago: 30,
  };
  loadingPeople = false;
  donwloadingExNom: boolean = false;
  donwloadingExcNov: boolean = false;
  donwloadingPdfNom: boolean = false;
  sendingPayrollEmail: boolean = false;
  pago: any = {};
  renderizar = false;
  funcionarios = [];
  funcionariosBase = [];

  people$ = new Observable();

  inicioParemeter: '';
  finParemeter: '';

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  listFuncionarios: any = [];

  constructor(
    private _payroll: PayRollService,
    private _swal: SwalService,
    private rute: ActivatedRoute,
    private router: Router,
    private readonly globalService: GlobalService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.people$ = this.globalService.getAllPeople$;
    const params = this.rute.snapshot.queryParams;
    if (Object.keys(params).length) {
      this.inicioParemeter = params.inicio;
      this.finParemeter = params.fin;
    }
    this.getPagoNomina();
  }

  openOvertime(officer) {
    const modalRef = this.modalService.open(HorasExtrasComponent);
    modalRef.componentInstance.overtime = officer.horas_extras;
  }

  openNews(officer) {
    const modalRef = this.modalService.open(ModalNovedadesComponent);
    modalRef.componentInstance.news = officer.novedades;
  }

  openIncomeBenefits(officer) {
    const modalRef = this.modalService.open(ModalIngresosPrestacionalesComponent);
    modalRef.componentInstance.data = {
      officer,
      payrollPay: this.nomina?.nomina_paga,
      paymentFreq: this.nomina?.frecuencia_pago,
    };
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'updated') this.getPagoNomina();
      },
    });
  }

  openIncomeNoBenefits(officer) {
    const modalRef = this.modalService.open(ModalIngresosNoPrestacionalesComponent);
    modalRef.componentInstance.data = {
      officer,
      payrollPay: this.nomina?.nomina_paga,
      paymentFreq: this.nomina?.frecuencia_pago,
    };
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'updated') this.getPagoNomina();
      },
    });
  }

  onDeductions(officer) {
    const modalRef = this.modalService.open(ModalDeduccionesComponent);
    modalRef.componentInstance.data = {
      officer,
      payrollPay: this.nomina?.nomina_paga,
      paymentFreq: this.nomina?.frecuencia_pago,
    };
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'updated') this.getPagoNomina();
      },
    });
  }

  getPagoNomina() {
    this.loadingPeople = true;
    const params =
      this.inicioParemeter && this.finParemeter
        ? {
            date1: this.inicioParemeter,
            date2: this.finParemeter,
          }
        : {};

    this._payroll.getPayrollPays(params).subscribe((r: any) => {
      this.nomina = r.data;
      this.pago.id = this.nomina?.nomina_paga_id ? this.nomina?.nomina_paga_id : '';

      this.getFuncionarios(r.data.funcionarios);
      this.getUsuario();
      this.loadingPeople = false;
    });
  }

  getUsuario() {
    this.pago.admin_id = 1;
  }

  getFuncionarios(data) {
    this.funcionarios = data;
    this.funcionariosBase = data;
    this.renderizar = true;
    this.pagination.length = this.funcionarios.length;
    this.refreshFuncionario();
  }

  refreshFuncionario() {
    const page = this.pagination.page;
    const pageSize = this.pagination.pageSize;
    this.listFuncionarios = this.funcionarios
      .map((func, i) => ({ id: i + 1, ...func }))
      .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  }

  personSelected: any;

  filter(event) {
    if (event) {
      let fun = this.funcionariosBase.find((r) => r.id == event);
      this.listFuncionarios = fun ? [fun] : [];
    } else {
      this.listFuncionarios = this.funcionariosBase;
    }
  }

  get inicioPeriodo() {
    return this.nomina?.inicio_periodo
      ? moment(this.nomina?.inicio_periodo).format('DD/MM/YYYY')
      : '';
  }
  get finPeriodo() {
    return this.nomina?.fin_periodo ? moment(this.nomina?.fin_periodo).format('DD/MM/YYYY') : '';
  }

  deletePagoNomina() {
    this._payroll.deletePayroll().subscribe(
      (r) => {},
      (err) => {},
    );
  }

  mostrarNovedades() {
    let params = {
      //date_start: moment("01-01-2020", ['DD-MM-YYYY']).format('YYYY-MM-DD'), //para pruebas y mostrar info
      date_start: moment(this.inicioPeriodo, ['DD/MM/YYYY']).format('YYYY-MM-DD'),
      date_end: moment(this.finPeriodo, ['DD/MM/YYYY']).format('YYYY-MM-DD'),
    };

    this._payroll.downloadExcNov(params).subscribe(
      (response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = 'reporte_novedades';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
        this.donwloadingExcNov = false;
      },
      (error: any) => {
        this.donwloadingExcNov = false;
        this._swal.hardError();
      },
      () => {
        this.donwloadingExcNov = false;
      },
    );
  }

  //Colillas de pago
  getColillasPago(datos: any) {
    this.donwloadingPdfNom = true;

    this._swal.show({
      title: '',
      text: 'Estamos descargando las colillas de pago, este proceso puede tardar algunos minutos.',
      icon: 'info',
      showCancel: false,
    });
    this._payroll.dowloadPdfColillas(datos).subscribe(
      (res: BlobPart) => {
        let blob = new Blob([res], { type: ' application/pdf' });
        let link = document.createElement('a');
        const filename = 'colillas-nomina'; //se podría poner período
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        this.donwloadingPdfNom = false;
      },
      (err: any) => {
        this.donwloadingPdfNom = false;
        this._swal.show({
          title: 'ERROR',
          text: 'Intenta nuevamente.',
          icon: 'error',
          showCancel: false,
        });
      },
      () => {
        this.donwloadingPdfNom = false;
        this._swal.show({
          title: 'Operación exitosa',
          text: 'Colillas de pago descargadas correctamente',
          icon: 'success',
          showCancel: false,
        });
      },
    );
  }

  //Resumen de nómina
  getColilla(fun: any) {
    this.donwloadingExNom = true;
    this._payroll.downloadExNomina(fun).subscribe((res: BlobPart) => {
      let blob = new Blob([res], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = 'reporte-nomina';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
    }),
      (err: any) => {},
      () => {};
    this.donwloadingExNom = false;
  }

  //Pagar Nomina
  postPagoNomina() {
    this.pago.start_period = this.nomina.inicio_periodo;
    this.pago.end_period = this.nomina.fin_periodo;
    this.pago.total_salaries = this.nomina.salarios;
    this.pago.total_retentions = this.nomina.retenciones;
    this.pago.total_provisions = this.nomina.provisiones;
    this.pago.total_social_secturity = this.nomina.seguridad_social;
    this.pago.total_parafiscals = this.nomina.parafiscales;
    this.pago.total_overtimes_surcharges = this.nomina.extras;
    this.pago.total_incomes = this.nomina.ingresos;
    this.pago.total_cost = this.nomina.costo_total_empresa;

    this._swal
      .show(
        {
          title: '¿Estás seguro(a)?',
          text: 'Vamos a generar una nómina, revisa que todo coincida antes de continuar.',
          icon: 'warning',
        },
        this.savePayroll,
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.getPagoNomina();
          this.renderizar = false;
        }
      });
  }

  savePayroll = async () => {
    await this._payroll
      .savePayroll(this.pago)
      .toPromise()
      .then((r: any) => {
        this._swal.show({
          title: 'Operación exitosa',
          text: 'Nómina guardada correctamente',
          icon: 'success',
          timer: 1000,
          showCancel: false,
        });
        this.router.navigateByUrl('/nomina/historial-pagos');
      })
      .catch((err: any) => {});
  };

  sendPayrollEmail() {
    if (!this.nomina.email_reported && this.nomina.email_reported == 0) {
      this._swal.show(
        {
          title: '¿Estás seguro(a)?',
          text: 'Vamos a enviar las colillas de pago via email, esta operación solo se puede realizar una vez y puede tardar varios.',
          icon: 'question',
        },
        this.serviceSend,
      );
    } else {
      this._swal.show({
        title: 'ERROR',
        text: 'Las colillas de pago ya fueron enviadas. ',
        icon: 'error',
        showCancel: false,
      });
    }
  }

  serviceSend = async () => {
    this.sendingPayrollEmail = true;
    const params =
      this.inicioParemeter && this.finParemeter
        ? {
            start: this.inicioParemeter,
            end: this.finParemeter,
            ...this.nomina,
          }
        : {
            start: this.datePipe.transform(this.nomina.inicio_periodo, 'yyyy-MM-dd'),
            end: this.datePipe.transform(this.nomina.fin_periodo, 'yyyy-MM-dd'),
            ...this.nomina,
          };
    await this._payroll
      .sendPayrollEmail(params)
      .toPromise()
      .then((res: any) => {
        this.sendingPayrollEmail = false;
        this._swal.show({
          title: 'Operación exitosa',
          text: 'Emails enviados correctamente',
          icon: 'success',
          showCancel: false,
        });
        this.ngOnInit();
      });
  };
}

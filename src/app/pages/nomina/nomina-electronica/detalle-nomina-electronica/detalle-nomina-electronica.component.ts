import { Component, OnInit, EventEmitter } from '@angular/core';
import { ElectronicPayrollsService } from '../electronic-payrolls.service';
import { ActivatedRoute } from '@angular/router';
import stats from './payload';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { PayrollStatusPipe } from '../../../../core/pipes/payroll-status.pipe';
import { HistoricoNominaElectronicaComponent } from '../historico-nomina-electronica/historico-nomina-electronica.component';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass, CurrencyPipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-detalle-nomina-electronica',
  templateUrl: './detalle-nomina-electronica.component.html',
  styleUrls: ['./detalle-nomina-electronica.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    NgIf,
    NgClass,
    HistoricoNominaElectronicaComponent,
    CurrencyPipe,
    DatePipe,
    PayrollStatusPipe,
  ],
})
export class DetalleNominaElectronicaComponent implements OnInit {
  getData = new EventEmitter<any>();
  statistics = stats;
  id = '';
  payrolls: any[] = [];

  constructor(
    private _electronicP: ElectronicPayrollsService,
    private route: ActivatedRoute,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getPayrolls();
    this.getStatistcs();
  }

  getPayrolls() {
    this._electronicP.getPayrolls(this.id).subscribe((r: any) => (this.payrolls = r.data.data));
  }
  getStatistcs() {
    this._electronicP.getStatistcs(this.id).subscribe((r: any) => {
      this.statistics = this.statistics.reduce((acc, el) => {
        el.cuantity = r.data[el.stats] ? r.data[el.stats] : 0;
        return [...acc, el];
      }, []);
    });
  }

  report(idPersonPayroll) {
    this._swal
      .show({
        title: '¿Esta seguro?',
        text: 'Se dispone a reportar la Nómina a la Dian',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          let id = this.id;
          this._electronicP.reportElectronic({ id, idPersonPayroll }).subscribe((r: any) => {
            this._swal.show({
              title: 'Reporte enviado correctamente',
              text: 'Por favor verifique el historico de la nómina',
              icon: 'success',
              showCancel: false,
            });
            this.getPayrolls();
            this.getStatistcs();
          });
        }
      });
  }

  deleteElectronicPayroll(id) {
    this._swal
      .show({
        title: '¿Esta seguro?',
        text: 'Se dispone a Eliminar el reporte de Nómina ante la Dian',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._electronicP.deleteElectronicPayroll(id).subscribe(
            (r) => {
              this._swal.show({
                title: 'Reporte enviado correctamente',
                text: 'Por favor verifique el historico de la nómina',
                icon: 'success',
                showCancel: false,
              });
              this.getPayrolls();
              this.getStatistcs();
            },
            (error) => {
              this._swal.show({
                title: 'Error',
                text: error.error,
                icon: 'error',
                showCancel: false,
              });
            },
          );
        }
      });
  }

  reportPendings() {
    this._swal
      .show({
        title: '¿Esta seguro?',
        text: 'Se dispone a reportar todas las Nóminas a la Dian que se encuentran pendientes',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._electronicP.reportAllElectronic(this.id).subscribe((r: any) => {
            this._swal.show({
              title: 'Reporte enviado correctamente',
              text: 'Por favor verifique el historico de la nómina',
              icon: 'success',
              showCancel: false,
            });
            this.getPayrolls();
            this.getStatistcs();
          });
        }
      });
  }

  get penginds() {
    return this.statistics.find((r) => r.stats == 'pending')['cuantity'];
  }
  get rejecteds() {
    return this.statistics.find((r) => r.stats == 'rejected')['cuantity'];
  }
}

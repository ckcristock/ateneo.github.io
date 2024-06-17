import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { HeaderDownloadComponent } from '@shared/components/standard-components/header-download/header-download.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { PrimasService } from '../primas.service';

@Component({
  selector: 'app-prima-funcionario',
  templateUrl: './prima-funcionario.component.html',
  styleUrls: ['./prima-funcionario.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, StandardModule, HeaderDownloadComponent, LoadImageComponent],
})
export class PrimaFuncionarioComponent implements OnInit {
  loading: boolean;
  empleados: any = {
    status: 'pendiente',
    empleados: [],
    person_payer: {
      first_name: '',
      second_name: '',
      first_surname: '',
      second_surname: '',
    },
  };

  habilitarPagar: boolean = false;
  employees: any[] = [];
  pagination = {
    pageSize: 10,
    page: 1,
    length: 0,
  };
  periodoObs: Observable<number>;
  anioObs: Observable<number>;
  anio: any;
  periodo: any;
  lapso: any;
  funcionario: any;

  loadingIndex = -1;

  constructor(
    private _primas: PrimasService,
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private _swal: SwalService,
    private _user: UserService,
  ) {
    this.paginator.itemsPerPageLabel = 'Items por página:';
    this.anioObs = route.params.pipe(map((p) => p.anio));
    this.periodoObs = route.params.pipe(map((p) => p.periodo));
    this.funcionario = this._user.user.person.id;
  }

  ngOnInit(): void {
    this.calcularPrimas();
    this.habilitarBotonPagar();
  }

  calcularPrimas() {
    this.loading = true;
    this.anioObs.subscribe((params) => (this.anio = params));
    this.periodoObs.subscribe((params) => (this.periodo = params));

    let params: any;
    if (this.periodo == 1) {
      params = {
        fecha_inicio: new Date(`01/01/${this.anio}`),
        fecha_fin: new Date(`06/30/${this.anio}`),
        period: this.anio + '-' + this.periodo,
      };
      this.lapso = ' enero - junio ';
    } else {
      params = {
        fecha_inicio: new Date(`07/01/${this.anio}`),
        fecha_fin: new Date(`12/30/${this.anio}`),
        period: this.anio + '-' + this.periodo,
      };
      this.lapso = ' julio - diciembre ';
    }

    this._primas.setBonus(params).subscribe((r: any) => {
      this.empleados = r.data;
      this.pagination.length = r.data.total_employees;
      this.loading = false;
      this.employees = this.paginate(this.empleados.empleados, 10)[0];
    });
  }

  pagar(empleados) {
    this._swal.show(
      {
        title: 'Prima',
        text: `¿Desea pagar primas del ${this.periodo} semestre ${this.anio}? (periodo: ${this.lapso})`,
        icon: 'warning',
        showCancel: true,
      },
      (res: any) => {
        if (res) {
          empleados['period'] = this.anio + '-' + this.periodo;
          empleados['funcionario'] = this.funcionario;
          empleados['status'] = 'pagado';
          //enviar petición para guardar tanto el detalle como el general,
          //primero guarda el general y con ese indice se guarda el detalle de cada funcionario
          //guardar el periodo para facilitar las revisiones futuras año-semestre
          this._primas.saveBonus(empleados).subscribe((res: any) => {
            this.empleados.person_payer = res.data.responsable;

            this._swal.show({
              title: 'Prima',
              text: res.data.message,
              icon: 'success',
              timer: 2000,
              showCancel: false,
            });
          });
        }
      },
    );
  }

  changePage() {
    this.employees = this.paginate(this.empleados.empleados, this.pagination.pageSize)[
      this.pagination.page
    ];
  }

  habilitarBotonPagar() {
    const hoy = new Date();
    //const hoy = new Date('2022-06-15');
    const hoyMes = hoy.getMonth();
    // 0: Enero, 1: Febrere, 2: Marzo, 3: Abril,
    // 4: Mayo, 5: Junio, 6: Julio, 7: Agosto,
    // 8: Septiembre, 9: Octubre, 10: Noviembre, 11: Diciembre

    if (hoyMes == 5 || hoyMes == 6 || hoyMes == 11 || hoyMes == 0) {
      this.habilitarPagar = true;
    } else {
      this.habilitarPagar = false;
    }
  }

  paginate(arr, size) {
    return arr.reduce((acc, val, i) => {
      let idx = Math.floor(i / size);
      let page = acc[idx] || (acc[idx] = []);
      page.push(val);

      return acc;
    }, []);
  }

  donwloadingExcel: boolean;
  getReport(status) {
    let params = {
      anio: this.anio,
      period: this.periodo,
      status: status == 'pendiente' ? 0 : 1,
    };
    this.donwloadingExcel = true;
    this._primas.getReport(params).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = 'reporte-primas';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
      this.donwloadingExcel = false;
    }),
      (error) => {
        this.loading = false;
        this.donwloadingExcel = false;
      },
      () => {
        this.loading = false;
      };
  }

  donwloadingPdfs: boolean;
  getReportPdfs() {
    this.donwloadingPdfs = true;
    let params = {
      anio: this.anio,
      period: this.periodo,
    };
    this._primas.getReportPdfs(params).subscribe((res: BlobPart) => {
      let blob = new Blob([res], { type: 'applicarion/pdf' });
      let link = document.createElement('a');
      const filename = 'colilla-primas';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.donwloadingPdfs = false;
    }),
      (err) => {
        this.loading = false;
        this.loadingIndex = -1;
      },
      () => {
        this.loading = false;
      };
  }

  getOneReportPdfs(id, period, index: number) {
    this.loadingIndex = index;
    let params = {
      id,
      period,
    };
    this._primas.getOneReportPdfs(params).subscribe((res: BlobPart) => {
      let blob = new Blob([res], { type: 'applicarion/pdf' });
      let link = document.createElement('a');
      const filename = 'colilla-prima' + params.period;
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.loadingIndex = -1;
    }),
      (err) => {
        this.loading = false;
        this.loadingIndex = -1;
      },
      () => {
        this.loading = false;
      };
  }
}

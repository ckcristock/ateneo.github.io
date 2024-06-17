import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PreliquidadosService } from './preliquidados.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import moment from 'moment';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DetalleService } from '../../ajustes/informacion-base/funcionarios/detalle-funcionario/detalle.service';
import { debounceTime, map, toArray } from 'rxjs/operators';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { NgIf, NgFor, AsyncPipe, UpperCasePipe, DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { GlobalService } from '@shared/services/global.service';
import { UserService } from 'src/app/core/services/user.service';
import { ImagePipe } from '../../../core/pipes/image.pipe';
import { AutocompleteFcComponent } from '../../../components/autocomplete-fc/autocomplete-fc.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-preliquidados',
  templateUrl: './preliquidados.component.html',
  styleUrls: ['./preliquidados.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    NgIf,
    NgFor,
    NgbTooltip,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteFcComponent,
    NotDataComponent,
    AsyncPipe,
    UpperCasePipe,
    DatePipe,
    ImagePipe,
  ],
})
export class PreliquidadosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  preliquidados: any = [];
  preliquidadosSelect: any = [];
  responsable: any = {};
  matPanel: boolean;
  people$ = new Observable();
  diffDays: any;
  loading: boolean = true;
  formFilters: UntypedFormGroup;
  active_filters: boolean = false;
  orderObj: any;
  paginationMaterial: any;
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  listPreliquidados: any = [];

  constructor(
    private router: Router,
    private _preliquidadosService: PreliquidadosService,
    private _swal: SwalService,
    private fb: UntypedFormBuilder,
    private _detalle: DetalleService,
    private _paginator: PaginatorService,
    private _user: UserService,
    readonly urlFiltersService: UrlFiltersService,
    private readonly globalService: GlobalService,
  ) {
    this.responsable = this._user.user;
  }

  ngOnInit(): void {
    this.createForm();
    this.getUrlFilters();
    this.people$ = this.globalService.getAllPeople$;
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.formFilters.patchValue(this.urlFiltersService.currentFilters);
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    // localStorage?.setItem('paginationPreliquidados', this.pagination?.pageSize);
    this.getPreliquidados();
  }

  resetFiltros() {
    this._paginator.resetFiltros(this.formFilters);
    this.active_filters = false;
  }

  SetFiltros(paginacion) {
    return this._paginator.SetFiltros(paginacion, this.pagination, this.formFilters);
  }
  //ok
  createForm() {
    this.formFilters = this.fb.group({
      person_id: '',
    });
    this.formFilters.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.getPreliquidados();
    });
  }

  openModal() {
    this.modal.show();
  }
  //ok
  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  getPreliquidadosList() {
    this._preliquidadosService.getPreliquidados().subscribe((res: any) => {
      this.preliquidadosSelect = res.data.data.map((pre) => ({
        text: pre.full_name,
        value: pre.id,
      }));
      this.preliquidadosSelect.unshift({ text: 'Todos', value: '' });
    });
  }

  getPreliquidados() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value,
    };
    this._preliquidadosService.getPreliquidados(params).subscribe((res: any) => {
      this.preliquidados = res.data.data;
      this.listPreliquidados = res.data.data;
      this.pagination.length = res.data.total;
      of(...this.listPreliquidados)
        .pipe(
          map(({ one_preliquidated_log, ...rest }: any) => ({
            ...rest,
            one_preliquidated_log: {
              ...one_preliquidated_log,
              created_at_timestamp: new Date(one_preliquidated_log.created_at).getTime(),
            },
          })),
          toArray(),
          map((arr) =>
            arr.sort(
              (a, b) =>
                b.one_preliquidated_log.created_at_timestamp -
                a.one_preliquidated_log.created_at_timestamp,
            ),
          ),
          map((arr) =>
            arr.map(({ one_preliquidated_log: { created_at_timestamp, ...log }, ...rest }) => ({
              ...rest,
              one_preliquidated_log: {
                ...log,
                created_at: created_at_timestamp
                  ? new Date(created_at_timestamp).toISOString()
                  : new Date('2000-01-01').toISOString(),
              },
            })),
          ),
        )
        .subscribe((sortedData) => (this.listPreliquidados = sortedData));

      this.loading = false;
      this.paginationMaterial = res.data;
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1;
        this.pagination.page = 1;
        this.getPreliquidados();
      }
      /* for (let index = 0; index < this.preliquidados.length; index++) {
          let fecha = this.preliquidados[index].log_created_at;
          let InfoH = fecha;
          this.preliquidados[index].log_created_at = InfoH;
        } */
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  // refreshPreLiquidated() {
  //   this.listPreliquidados = this.preliquidados.map((preliq, i) => ({ id: i + 1, ...preliq })).slice(
  //     (this.page - 1) * this.pageSize,
  //     (this.page - 1) * this.pageSize + this.pageSize,
  //   );
  // }

  cantidadDate(fecha) {
    let now = moment(fecha).startOf('D').fromNow();
    let hoy = new Date();
    let fecha1 = moment(hoy, 'YYYY-MM-DD HH:mm:ss');
    let fecha2 = moment(fecha, 'YYYY-MM-DD HH:mm:ss');
    let horas = Math.abs(fecha2.diff(fecha1, 'h'));
    let tiempo = '';
    if (horas > 24) {
      let dias = horas / 24;
      dias = Math.trunc(dias);
      tiempo = 'Hace ' + dias + ' Dias';
      if (dias > 30) {
        let meses = dias / 30;
        meses = Math.trunc(meses);
        tiempo = 'Hace ' + meses + ' Meses';
        if (meses > 12) {
          let años = meses / 12;
          años = Math.trunc(años);
          tiempo = 'Hace ' + años + ' Años';
        }
      }
    } else if (horas == 0) {
      tiempo = 'Hace un momento ';
    } else {
      tiempo = 'Hace ' + horas + ' Horas';
    }
    return {
      tiempo: tiempo,
      horas: horas,
    };
  }

  alert(id) {
    Swal.fire({
      icon: 'question',
      title: '¿Desea incluir el salario no pagado?',
      input: 'select',
      inputOptions: {
        si: 'Sí',
        no: 'No',
      },
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Liquidar',
      confirmButtonColor: '#3849CA',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['rrhh/liquidado/', id, result.value]);
      }
    });
  }

  activate(preliquidado: any) {
    const info = {
      id: preliquidado.id,
      identifier: preliquidado.identifier,
      full_name: preliquidado.first_name + ' ' + preliquidado.first_surname,
      contract_work: preliquidado.work_contract_id ?? 0,
      liquidated_at: moment().format('YYYY-MM-DD'),
      reponsible: {
        person_id: this.responsable.id,
        usuario: this.responsable.usuario,
      },
      status: 'Reincorporado',
    };

    const request = () => {
      this._detalle.setPreliquidadoLog(info).subscribe({
        next: (responseLog: any) => {
          if (responseLog.status) {
            this._preliquidadosService
              .activate({ status: 'Activo' }, preliquidado.id)
              .subscribe((r: any) => {
                this.getPreliquidados();
                this._swal.show({
                  icon: 'success',
                  title: 'Proceso finalizado',
                  text: 'El funcionario ha sido activado con éxito.',
                  showCancel: false,
                  timer: 1000,
                });
              });
            this._detalle
              .blockUser({ status: 'Activo' }, preliquidado.id)
              .subscribe((r: any) => {});
          } else {
            this._swal.error();
          }
        },
        error: () => {
          this._swal.hardError();
        },
      });
    };
    this._swal.swalLoading('Vamos a activar a este empleado', request);
  }
}

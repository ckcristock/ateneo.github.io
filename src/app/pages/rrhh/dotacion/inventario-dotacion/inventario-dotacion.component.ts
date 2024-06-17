import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location, NgIf, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DotacionService } from '../dotacion.service';
import { NgForm, FormsModule } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { consts } from 'src/app/core/utils/consts';
import { PuntosPipe } from '../../../../core/pipes/puntos';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { MatInputModule } from '@angular/material/input';
import { NgChartsModule } from 'ng2-charts';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { InputPositionInitialDirective } from '../../../../core/directives/input-position-initial.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { UserService } from 'src/app/core/services/user.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inventario-dotacion',
  templateUrl: './inventario-dotacion.component.html',
  styleUrls: ['./inventario-dotacion.component.scss'],
  standalone: true,
  imports: [
    ModalComponent,
    CardComponent,
    AddButtonComponent,
    HeaderButtonComponent,
    TableComponent,
    NgIf,
    FormsModule,
    NgxCurrencyDirective,
    InputPositionInitialDirective,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgChartsModule,
    MatInputModule,
    MatIconModule,
    DropdownActionsComponent,
    ActionDeactivateComponent,
    NotDataComponent,
    DecimalPipe,
    PuntosPipe,
  ],
})
export class InventarioDotacionComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('inputEdit', { static: false }) inputEditRef: ElementRef;

  downloading = false;
  firstDay: any;
  lastDay: any;
  mask = consts;

  pagination = {
    pageSize: 100,
    page: 1,
    length: 0,
  };

  public Inventarios: any[] = [];
  public Lista_Grupos_Inventario: any = [];
  public loading: boolean = false;
  public filtros: any = {
    nombre: '',
    talla: '',
    tipo: '',
    calidad: '',
  };
  public person_id: any;
  activeFilters = false;

  constructor(
    private _dotation: DotacionService,
    private readonly modalService: NgbModal,
    private _swal: SwalService,
    readonly UrlFiltersService: UrlFiltersService,
    private readonly _user: UserService,
  ) {}

  ngOnInit() {
    this.person_id = this._user.user.person.id;
    this.getUrlFilters();
    this.ListaInventario();
    this.listarGrupo();
    // this.Graficar();
  }

  openModal(modal: any): void {
    this.modalService.open(modal, { size: 'lg' });
  }

  // public barChartOptions: any = {
  //   responsive: true,
  //   // We use these empty structures as placeholders for dynamic theming.
  //   scales: { xAxes: [{}], yAxes: [{}] },
  //   plugins: {
  //     datalabels: {
  //       anchor: 'end',
  //       align: 'end',
  //     },
  //   },
  // };
  // public barChartLabels: any = ['Categorías'];
  // public barChartType: ChartType = 'bar';
  // public barChartLegend = true;
  // public barChartData: ChartDataset[] = [];
  // graphicData: any = {};

  // Graficar() {
  //   // this._dotation.getDotationTotalByCategory({ cantMes: this.selectedMes }).subscribe((d: any) => {
  //   this._dotation
  //     .getTotatInventary({
  //       // firstDay: this.firstDay,
  //       // lastDay: this.lastDay,
  //       // person: this.people_id,
  //       //  persontwo: this.people_id_two,
  //       //  cod: this.cod,
  //       //  type: this.type,
  //       //  delivery: this.delivery,
  //       //  art: this.art,
  //     })
  //     .subscribe((d: any) => {
  //       let totals: any[] = d.data;

  //       if (totals) {
  //         this.barChartData = totals.reduce((acc, el) => {
  //           let daSet = { data: [el.value], label: [el.name] };
  //           return [...acc, daSet];
  //         }, []);
  //       }
  //     });
  // }

  //descarga inventario de últimos 30 dias con un endpoint
  DownloadInventoryDotation() {
    let params = this.filtros;
    this.downloading = true;
    this._dotation.DownloadInventoryDotation(params).subscribe(
      (response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = 'reporte-inventario-' + new Date().toISOString().split('T')[0];
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
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

  private getUrlFilters(): void {
    this.pagination = this.UrlFiltersService.currentPagination;
    this.filtros = this.UrlFiltersService.currentFilters;
    if (this.filtros.tipo === undefined) this.filtros.tipo = '';
    if (this.filtros.calidad === undefined) this.filtros.calidad = '';
  }
  ListaInventario() {
    this.loading = true;
    let queryString = '';
    let params = {
      ...this.pagination,
      ...this.filtros,
    };

    queryString =
      '' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    this.UrlFiltersService.setUrlFilters(params);

    this._dotation.getInventary(params).subscribe((r: any) => {
      this.loading = false;
      this.Inventarios = r.data.data;
      this.pagination.length = r.data.total;
    });
  }
  // guardar, crear nueva categoría o grupo
  GuardarGrupo(form: NgForm) {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: 'Vamos a guardar la categoría',
      })
      .then((result) => {
        if (result.value) {
          this.sendData(form);
        }
      });
  }

  // esta funcion la usar GuardarGrupo-Categoria() arriba
  sendData(form: NgForm) {
    const data = form.value;
    this._dotation.saveProductDotationTypes(data).subscribe((data: any) => {
      if (data.code == 200) {
        this._swal.show({
          icon: 'success',
          title: 'Operación exitosa',
          showCancel: false,
          text: 'Categoria guardada',
          timer: 1000,
        });
        this.listarGrupo();
        form.onReset();
      } else {
        this._swal.show({
          icon: 'error',
          title: 'Operación denegada',
          showCancel: false,
          text: 'Ha ocurrido un error',
        });
      }
    });
  }

  // anular categoría en modal
  removeCategory(id: number, name: string): void {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: `Vamos a eliminar la categoría ${name}`,
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._dotation.removeCategory(id).subscribe({
            next: (res) => {
              if (res.err && res.code != 200) {
                this._swal.show({
                  icon: 'error',
                  title: 'Error',
                  text: res.err,
                  showCancel: false,
                });
                return;
              }
              this._swal.show({
                icon: 'success',
                title: 'Eliminada con éxito',
                showCancel: false,
              });
              this.listarGrupo();
            },
          });
        }
      });
  }

  // lista los grupos o categorías
  listarGrupo() {
    this._dotation.getProductDotationTypes().subscribe((data: any) => {
      this.Lista_Grupos_Inventario = data.data;
    });
  }

  // esta función actualiza la cantidad del item
  update(item, index) {
    const request = (resolve: CallableFunction) => {
      item.remaining_stock = this.inputEditRef.nativeElement.value;
      this._dotation.updateStock(item).subscribe({
        next: () => {
          resolve(true);
          let swal = {
            icon: 'success',
            title: 'Operación exitosa',
            text: 'Stock modificado',
            timer: null,
            showCancel: false,
          };
          this._swal.show(swal);
          this.ListaInventario();
        },
      });
    };
    this._swal.swalLoading('Vas a modificar el stock', request);
  }
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/services/person/person.service';
import { DotacionService } from '../../dotacion.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { consts } from 'src/app/core/utils/consts';
import { PageEvent } from '@angular/material/paginator';
import { DotacionSalidasComponent } from '../dotacion-salidas/dotacion-salidas.component';
import { DotacionEntradasComponent } from '../dotacion-entradas/dotacion-entradas.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { InputPositionInitialDirective } from '../../../../../core/directives/input-position-initial.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { TableComponent } from '../../../../../shared/components/standard-components/table/table.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteMdlComponent } from '../../../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-stock',
  templateUrl: './table-stock.component.html',
  styleUrls: ['./table-stock.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    AutocompleteMdlComponent,
    MatFormFieldModule,
    MatInputModule,
    TableComponent,
    NgxCurrencyDirective,
    InputPositionInitialDirective,
    NgClass,
    TextFieldModule,
    DotacionEntradasComponent,
    DotacionSalidasComponent,
  ],
})
export class TableStockComponent implements OnInit {
  @Input('type') type;
  @Input('name') name;
  @Input('entrega') entrega = false;
  @Input('find') find = true;

  @Output('closeModal') closeModal = new EventEmitter();

  @ViewChild('modalEntregaEpp') modalEntregaEpp: any;
  @ViewChild('modalSalidas') modalSalidas: any;
  @ViewChild('modalApartadas') modalApartadas: any;
  @ViewChild('FormDotacion') FormDotacion: any;

  openModal = new EventEmitter<any>();
  openModalSalidas = new EventEmitter<any>();

  public Lista_Grupos_Inventario1: any = [];
  public Apartadas: any = [];
  public Lista_Grupos_Inventario_Epp: any = [];
  public Empleados: any[] = [];
  people: any[] = [];

  loading = false;
  public cam: boolean = false;
  public flagDotacionApp: boolean = false;
  masks = consts;
  titulo: string = '';
  tipoEntrega: string = '';

  pagination = {
    pageSize: 15,
    page: 1,
    length: 0,
  };

  public Entrega: any = {
    person_id: null,
    cost: 0,
    code: '',
    description: '',
    type: '',
  };

  filtros: any = {
    name: '',
  };

  groupInventoryMemory: Record<number, any[]> = {};

  currentPage = 0;

  constructor(
    private _dotation: DotacionService,
    private _person: PersonService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) {}

  formatter4 = (x: { Nombres: string }) => x.Nombres;
  search4 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 1
          ? []
          : this.Empleados.filter(
              (v) => v.Nombres.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 100),
      ),
    );

  ngOnInit(): void {
    if (this.find) {
      this.search();
    }
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  private getDismissReason(reason: any) {}

  search(value = '') {
    this.tipoEntrega = value;
    this.getPeople();
    this.Lista_Empleados();
    this.getData();
  }

  getData() {
    let params = {
      ...this.pagination,
      ...this.filtros,
      type: this.type ? this.type : this.tipoEntrega,
    };

    this.entrega ? (params.entrega = true) : '';
    this.loading = true;
    if (this.pagination.page <= this.currentPage) {
      this.Lista_Grupos_Inventario1 = [...this.groupInventoryMemory[this.pagination.page]];
      this.loading = false;
      return;
    }
    this._dotation.getStok(params).subscribe((r: any) => {
      this.currentPage = this.pagination.page;
      this.groupInventoryMemory[this.pagination.page] = r.data.data;
      this.Lista_Grupos_Inventario1 = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
  }

  getPeople() {
    this._person.getAll({}).subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: 0 });
    });
  }

  Lista_Empleados() {
    this._person.getPersonCompany().subscribe((r: any) => {
      this.Empleados = r.data;
    });
  } ///FINAL LISTAR EMPLEADOS

  cerrarModal() {
    this.closeModal.next('');
  }

  listarSalidas(q) {
    this.openModalSalidas.next({ data: q });
  }
  listarEntradas(q) {
    this.openModal.next({ data: q });
  }

  getApartadas({ id }, modal) {
    let params = {
      ...this.pagination,
      ...this.filtros,
      id: id,
    };
    this.loading = true;
    this._dotation.getSelected(params).subscribe((r: any) => {
      this.Apartadas = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
    //this.modalApartadas.show();
    this.openConfirm(modal);
  }

  maxLengthCheck(object) {
    if (object.value.max > object.max) object.value = object.value.slice(0, object.max);
  }

  cambio(prod) {
    Object.keys(prod).forEach((x) => {
      if (prod['quantity'] > prod['stock'] - prod['cantidadA']) {
        this.cam = true;
      } else {
        this.cam = false;
      }
    });
  }

  save() {
    let joinGroupInventary = [];
    Object.values(this.groupInventoryMemory).forEach((groupInv) => {
      joinGroupInventary = joinGroupInventary.concat(groupInv);
    });
    let prods: Array<any> = joinGroupInventary.filter((r) => r.quantity && r.quantity != '0');
    if (
      !this.Entrega.person_id ||
      !this.Entrega.dispatched_at ||
      !this.Entrega.description ||
      !prods.length
    ) {
      this._swal.incompleteError();
    } else {
      const request = () => {
        this.GuardarEntrega(prods);
      };
      this._swal.swalLoading('Vas a generar una nueva dotación', request);
    }
  }

  GuardarEntrega(prods) {
    // this.Entrega.type = this.flagDotacionApp ? 'Dotacion' : 'EPP';
    // this.Entrega.type = this.type ? 'Dotacion' : 'EPP';
    this.Entrega.type = this.type ? this.type : this.tipoEntrega;
    let entrega = this.Entrega;

    // let prods: Array<any> = this.Lista_Grupos_Inventario1;
    // let prods: Array<any> = this.flagDotacionApp ? this.Lista_Grupos_Inventario1 : this.Lista_Grupos_Inventario_Epp;
    // let prods: Array<any> = this.Lista_Grupos_Inventario1;

    // prods = prods.reduce((acc, el) => {
    //   return (prod.length == 0 ? acc : [...acc, ...prod])
    // }, [])

    this._dotation.saveDotation({ entrega, prods }).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          icon: 'success',
          title: 'Operación exitosa',
          showCancel: false,
          text: 'Dotación guardada',
          timer: 1000,
        });
        this.cerrarModal();
        // this.onChange1();
        // this.modalEntrega.hide()
        // this.modalEntregaEpp.hide()
        // this.ListarDotaciones()

        this.Entrega = {
          person_id: '',
          cost: 0,
          code: '',
          description: '',
          // type: 'Dotacion'
          type: '',
        };
      } else {
        this._swal.show({
          icon: 'error',
          title: 'Operación denegada',
          showCancel: false,
          text: r.err,
        });
      }
    });
  }
}

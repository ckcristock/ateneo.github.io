import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { DotacionService } from '../../dotacion.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-dotacion-salidas',
  templateUrl: './dotacion-salidas.component.html',
  styleUrls: ['./dotacion-salidas.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgbPagination, NotDataComponent],
})
export class DotacionSalidasComponent implements OnInit {
  @Input('openSalida') open: EventEmitter<any>;
  @ViewChild('modal') modal: any;
  @ViewChild('addEntregas') modalEntrega: any;

  loading = false;

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  };

  filtros: any = {
    cod: '',
  };

  public Lista_Entrega_Dotacion: any = [];

  constructor(
    private _dotation: DotacionService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getDotationsProduct();
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
  private getDismissReason(reason: any) {
    this.limpiar();
  }

  limpiar() {
    this.Lista_Entrega_Dotacion = [];
  }

  getDotationsProduct(page = 1) {
    this.open.subscribe((r) => {
      if (r?.data) {
        //this.modal.show();
        this.openConfirm(this.modalEntrega);
        this.pagination.page = page;
        let params = {
          ...this.pagination,
          ...this.filtros,
          code: r.data.code,
        };
        this.loading = true;
        this._dotation.getDotationsProduct({ params }).subscribe((r: any) => {
          this.Lista_Entrega_Dotacion = r.data.data;
          this.pagination.collectionSize = r.data.total;
          this.loading = false;
        });
      }
    });
  }
}

// ListarDotaciones(page = 1){
//   this.pagination.page = page;
//   let params = {
//     ...this.pagination, ...this.filtros
//   }
//   this.loading = true;
//   this._dotation.getDotations(params).subscribe((r:any) => {
//     this.Lista_Dotaciones = r.data.data;
//     this.pagination.collectionSize = r.data.total;
//     this.loading = false;
//   });
// }

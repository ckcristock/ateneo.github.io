import { Component, Input, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dotacion-entradas',
  templateUrl: './dotacion-entradas.component.html',
  styleUrls: ['./dotacion-entradas.component.scss'],
  standalone: true,
})
export class DotacionEntradasComponent implements OnInit {
  @Input('open') open: EventEmitter<any>;
  @ViewChild('modal') modal: any;
  @ViewChild('addSalidas') salidas: any;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.open.subscribe((r) => {
      if (r?.data) {
        //this.modal.show();
        this.openConfirm(this.salidas);
      } else {
        // this.createForm();
      }
    });
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
}

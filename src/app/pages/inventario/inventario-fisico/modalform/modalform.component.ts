import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-modalform',
  templateUrl: './modalform.component.html',
  styleUrls: ['./modalform.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, NgIf],
})
export class ModalformComponent implements OnInit {
  Funcionario_Cuenta: number = null;
  Funcionario_Digita: number = null;
  Codigo_Barras: string = '';
  queryParams;

  /**
   * variables que contienen errores
   */
  Error_Funcionario_Cuenta = false;
  Error_Funcionario_Digita = false;
  Error_Codigo_Barras = false;
  public loading: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private http: HttpClient,
    private router: Router,
    private swalService: SwalService,
  ) {}

  ngOnInit() {}
  buscarDatos() {}

  listarProductosCategoria() {
    this.loading = true;

    let params: any = {
      Contador: this.Funcionario_Cuenta,
      Digitador: this.Funcionario_Digita,
      Codigo_Barras: this.Codigo_Barras,
    };

    this.http
      .get(environment.base_url + '/php/inventariofisico/estiba/iniciar_inventario.php', { params })
      .subscribe((data: any) => {
        if (data.Tipo == 'success') {
          this.router.navigate(['/inventario/inventario-estibas', data.Id_Doc_Inventario_Fisico]);
          this.activeModal.close('Close click');
          this.swalService.show({
            title: data.Title,
            text: data.Text,
            icon: 'success',
            showCancel: false,
            timer: 1000,
          });
        } else {
          this.swalService.show({
            title: data.Title,
            text: data.Text,
            icon: 'error',
            showCancel: false,
          });
        }
        //abre modal alerta
        this.loading = false;
      });
  }

  isButtonDisabled(): boolean {
    console.log('this.Codigo_Barras', this.Codigo_Barras);
    return (
      this.Codigo_Barras === '' ||
      this.Funcionario_Digita == null ||
      this.Funcionario_Digita === 0 ||
      this.Funcionario_Cuenta == null ||
      this.Funcionario_Cuenta === 0
    );
  }
}

/** modal alert */

@Component({
  template: `
    <div
      class="modal-header header-red"
      [ngClass]="{ 'header-red': !success, 'header-blue': success }"
    >
      <h4 class="modal-title text-white">{{ title }}</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body d-flex flex-row align-items-center">
      <i
        class="fa  fa-5x"
        [ngClass]="{
          'text-danger font-weight-bold fa-times-circle': !success,
          'text-primary fa-check-circle': success
        }"
      ></i>
      <h5 class="ml-2 text-alert">{{ texto }}</h5>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">
        Close
      </button>
    </div>
  `,
  styleUrls: ['./modalform.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class ModalAlert {
  @Input() tipo;
  @Input() title;
  @Input() texto;
  success;
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private modalService: NgbModal,
  ) {}
  ngOnInit(): void {
    if (this.tipo == 'success') {
      this.success = true;
    } else {
      this.success = false;
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgIf, LowerCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-iniciarinventario',
  templateUrl: './iniciarinventario.component.html',
  styleUrls: ['./iniciarinventario.component.scss'],
  standalone: true,
  imports: [ModalComponent, MatFormFieldModule, MatInputModule, FormsModule, NgIf, LowerCasePipe],
})
export class IniciarinventarioComponent implements OnInit {
  @ViewChild('infoSwal') infoSwal: any;
  @ViewChild('modalInventario') modalInventario: any;
  @Input('iniciarInventario') iniciarInventario: EventEmitter<any>;

  @Input() Tipo = '';
  Funcionario_Cuenta;
  Funcionario_Digita;
  Codigo_Barras;
  queryParams;
  /**
   * variables que contienen errores
   */
  Error_Funcionario_Cuenta = false;
  Error_Funcionario_Digita = false;
  Error_Codigo_Barras = false;

  globales = environment;

  optionsAlert: any = {
    title: '¿Está Seguro?',
    text: 'Se dispone a Iniciar el inventario',
    icon: 'warning',
    showCancelButton: 'true',
    confirmButtonText: 'Si, Guardar',
    cancelButtonText: 'No, Dejame Comprobar!',
    confirm: this.guardarBodega(),
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    // this.iniciarInventario.subscribe((data: any) => {
    //   this.Tipo = data.tipo;
    //   this.modalInventario.show();
    // });
  }

  onSaveInventory(): void {
    Swal.fire(this.optionsAlert);
  }

  buscarDatos() {}

  guardarBodega() {
    let Codigo_Barras = this.Codigo_Barras;
    if (!this.Funcionario_Digita || this.Funcionario_Cuenta == '') {
      this.Error_Funcionario_Digita = true;
      return false;
    }
    if (!this.Funcionario_Cuenta || this.Funcionario_Cuenta == '') {
      this.Error_Funcionario_Cuenta = true;
      return false;
    }
    if (!this.Codigo_Barras || this.Codigo_Barras == '') {
      this.Error_Funcionario_Digita = true;
      return false;
    }

    let params: any = {
      Contador: this.Funcionario_Cuenta,
      Digitador: this.Funcionario_Digita,
      Codigo_Barras: this.Codigo_Barras,
      Tipo: this.Tipo,
    };

    this.http
      .get(this.globales.ruta + 'php/inventariofisico/estiba/iniciar_inventario.php', { params })
      .subscribe((data: any) => {
        if (data.Tipo == 'success') {
          this.infoSwal.type = data.Tipo;
          this.infoSwal.title = data.Title;
          this.infoSwal.text = data.Text;
          this.infoSwal.show();

          this.router.navigate(['/inventarioestibaspuntos', data.Id_Doc_Inventario_Fisico]);
        } else {
          this.infoSwal.type = data.Tipo;
          this.infoSwal.title = data.Title;
          this.infoSwal.text = data.Text;
          this.infoSwal.show();
        }
        //abre modal alerta
      });
  }
}

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ActarecepcionremisionService } from '../../actarecepcionremision.service';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { GeneralService } from '@app/services/general.service';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-productosactarecepcion',
  standalone: true,
  imports: [FormsModule, TableComponent, NgIf, NgFor],
  templateUrl: './productosactarecepcion.component.html',
  styleUrls: ['./productosactarecepcion.component.scss'],
})
export class ProductosactarecepcionComponent implements OnInit {
  @Input() Productos;
  @Input() Temperatura;
  @Input() Observaciones;
  @Input() Productos_Pendientes;
  @Input() Id_Remision;

  public Model: any = {
    Observaciones: '',
    Identificacion_Funcionario: '',
    Id_Remision: '',
  };
  public alertOption: any = {};

  constructor(
    private actarecepcionremision: ActarecepcionremisionService,
    private swal: SwalService,
    private general: GeneralService,
    private router: Router,
    private readonly userService: UserService,
  ) {}

  @ViewChild('confirmacionGuardar') confirmacionGuardar: any;
  ngOnInit() {}
  GuardarActa() {
    this.CompletarDatos();

    let data = new FormData();
    let modelo = this.general.normalize(JSON.stringify(this.Productos));
    let datos = this.general.normalize(
      JSON.stringify({ ...this.Model, company_id: this.userService.user.person.company_worked.id }),
    );
    data.append('modelo', modelo);
    data.append('datos', datos);
    this.actarecepcionremision.saveActaRemision(data).subscribe((data: any) => {
      this.swal.show({ ...data.data, showCancel: false });
      this.VerPantallaLista();
    });
  }
  VerPantallaLista() {
    this.router.navigate(['/inventario/acta-recepcion-remisiones']);
  }
  CompletarDatos() {
    this.Model = {
      Observaciones: this.Observaciones,
      Identificacion_Funcionario: this.userService.user.person.identifier,
      Id_Remision: this.Id_Remision,
      Id_Punto_Dispensacion: localStorage.getItem('Punto'),
    };
  }
  ValidarProductos() {
    if (this.Temperatura == 'Si') {
      var validado = true;

      for (let index = 0; index < this.Productos.length; index++) {
        if (this.Productos[index].Temperatura == '') {
          validado = false;
          var texto = {
            titulo: 'Falta deligenciar algunos campos',
            codigo: 'error',
            mensaje: 'Hay algunos campos de temperatura vacios, por favor revise ',
          };
          this.swal.ShowMessage(texto);
          break;
        }

        if (index == this.Productos.length - 1 && validado == true) {
          this.swal.swalLoading('Se dispone a Guardar esta acta de recepcion', this.keepRecords);
        }
      }

      if (this.Productos.length == 0) {
        this.swal.swalLoading('Se dispone a Guardar esta acta de recepcion', this.keepRecords);
      }
    } else {
      this.swal.swalLoading('Se dispone a Guardar esta acta de recepcion', this.keepRecords);
    }
  }

  private keepRecords = () => {
    this.GuardarActa();
  };
}

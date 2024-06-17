import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DireccionamientoService } from '../direccionamiento.service';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-direccionamiento',
  templateUrl: './direccionamiento.component.html',
  styleUrls: ['./direccionamiento.component.scss'],
  standalone: true,
  imports: [CabeceraComponent, RouterLink],
})
export class DireccionamientoComponent implements OnInit {
  public Id: any = this.route.snapshot.params['id'];
  public Datos: any = {};
  public Productos: any = [];
  public DatosCabecera: any = {
    Titulo: 'Direccionamiento',
    Fecha: new Date(),
    Codigo: '',
  };
  constructor(
    private route: ActivatedRoute,
    private _direccionamientos: DireccionamientoService,
  ) {
    this.GetDetalleDireccionamiento();
  }

  ngOnInit() {}

  GetDetalleDireccionamiento() {
    this._direccionamientos.getDetallesDireccionamiento(this.Id).subscribe((data) => {
      if (data.codigo == 'success') {
        this.Datos = data.query_result;
        this.Productos = data.productos;
      } else {
        this.Productos = [];
      }
    });
  }
}

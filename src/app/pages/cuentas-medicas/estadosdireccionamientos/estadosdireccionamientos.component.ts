import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, NgClass } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { AutomaticSearchComponent } from '../../../shared/components/automatic-search/automatic-search.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-estadosdireccionamientos',
  templateUrl: './estadosdireccionamientos.component.html',
  styleUrls: ['./estadosdireccionamientos.component.scss'],
  standalone: true,
  imports: [MatExpansionModule, AutomaticSearchComponent, NotDataComponent, NgClass],
})
export class EstadosdireccionamientosComponent implements OnInit {
  public Direccionamientos: any[] = [];
  public Cargando: boolean = false;
  public Prescripcion: string = '';
  globales = environment;
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private _swalService: SwalService,
  ) {}

  ngOnInit() {}

  ConsultarPrescripcion() {
    if (this.Prescripcion.length >= 20) {
      this.Cargando = true;
      this.http
        .get(
          this.globales.ruta +
            '/php/mipres/get_direccionamientos_prescripcion.php?prescripcion=' +
            this.Prescripcion,
        )
        .subscribe((data: any) => {
          this.Direccionamientos = data;
          this.Cargando = false;
        });
    } else {
      this._swalService.show({
        icon: 'error',
        title: 'Prescripción Inválida',
        text: 'La Prescripción debe ser de 20 caracteres',
        showCancel: false,
      });
    }
  }
}

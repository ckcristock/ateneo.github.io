import { Component, Input, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ExtraHoursService } from '../extra-hours.service';
import { FijoComponent } from './fijo/fijo.component';
import { RotativoComponent } from './rotativo/rotativo.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-lista-fijos',
  templateUrl: './lista-fijos.component.html',
  styleUrls: ['./lista-fijos.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, RotativoComponent, FijoComponent, NotDataComponent],
})
export class ListaFijosComponent implements OnInit {
  @Input('person') person;
  @Input('turnType') turnType;
  @Input('primerDia') primerDia;
  @Input('ultimodiaDia') ultimodiaDia;
  @ViewChild('childRotativo') childRotativo: RotativoComponent;

  constructor(
    private _extraHour: ExtraHoursService,
    private _swal: SwalService,
  ) {}

  personData: any;
  loading: boolean = false;
  dayswork: any[] = [];
  information: any[] = [];
  validada: boolean = false;

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.loading = true;
    let data = {
      id: this.person.id,
      tipo: this.person.turn_type,
      pd: this.primerDia,
      ud: this.ultimodiaDia,
    };
    this._extraHour.getDetailPeople(data).subscribe((r: any) => {
      this.personData = r.data;
      this.dayswork = this.personData.days_work;
      this.loading = false;
    });
  }

  data(data) {
    let dia = {
      person_id: data.person_id,
      date: data.date,
      ht: data.horasTrabajadas,
      hed: data.horasExtrasDiurnas,
      hen: data.horasExtrasNocturnas,
      heddf: data.horasExtrasDiurnasFestivasDom,
      hendf: data.horasExtrasNocturnasFestivasDom,
      hrn: data.recargosNocturnos,
      hrddf: data.recargosFestivos,
      hrndf: data.recargosNocturnosFestivos,
      hed_reales: data.horasExtrasDiurnasReales,
      hen_reales: data.horasExtrasNocturnasReales,
      hedfd_reales: data.horasExtrasDiurnasFestivasDomReales,
      hedfn_reales: data.horasExtrasNocturnasFestivasDomReales,
      rn_reales: data.recargosNocturnosReales,
      rf_reales: data.recargosFestivosReales,
      rnf_reales: data.recargosNocturnosFestivosReales,
      validada: data.validada,
    };
    this.information.push(dia);
  }

  validarExtras = () => {
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Vas a realizar la validación de las horas extras del funcionario, confirma que todo coincida correctamente pues esto afectará los cálculos de nómina.',
        icon: 'warning',
      })
      .then((res) => {
        if (res.isConfirmed) {
          this._extraHour.createExtrasWeek(this.information).subscribe(this.respuesta);
        }
      });
  };

  respuesta = (r: any) => {
    if (r.status) {
      this._swal.show({
        title: 'Guardado con éxito',
        text: `La validación de horas extras de la semana para ${this.person.first_name} se generó con éxito`,
        icon: 'success',
        showCancel: false,
      });
      this.ngOnInit();
    } else {
      this._swal.show({
        title: 'Ocurrió un error al guardar',
        text: r.err,
        icon: 'error',
        showCancel: false,
      });
    }
  };
}

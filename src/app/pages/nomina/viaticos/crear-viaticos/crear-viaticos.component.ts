import { NgFor, NgIf, UpperCasePipe, LowerCasePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { viaticos } from '../viaticos';
import { CrearViaticosService } from './crear-viaticos.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';
import * as help from './helpers/import';
import { consts } from 'src/app/core/utils/consts';
import { InputPositionUsdDirective } from '../../../../core/directives/input-position-usd.directive';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { InputPositionDirective } from '../../../../core/directives/input-position.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { InputPositionInitialDirective } from '../../../../core/directives/input-position-initial.directive';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteFcComponent } from '../../../../components/autocomplete-fc/autocomplete-fc.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
@Component({
  selector: 'app-crear-viaticos',
  templateUrl: './crear-viaticos.component.html',
  styleUrls: ['./crear-viaticos.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AutocompleteFcComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    InputPositionInitialDirective,
    NgxCurrencyDirective,
    NgIf,
    InputPositionDirective,
    NgbTooltip,
    TextFieldModule,
    InputPositionUsdDirective,
    UpperCasePipe,
    LowerCasePipe,
    DecimalPipe,
    CardComponent,
  ],
})
export class CrearViaticosComponent implements OnInit {
  @Input('id') id;
  @Input('data') data;
  @Input('title') title = 'Crear viático';
  func: any = {
    id: '',
    identifier: '',
    position: '',
    passport_number: '',
    visa: '',
    type: '',
  };

  origen = viaticos.origen;
  masks = consts;

  city: any = [];
  tipos: any = ['Selecciona', 'Nacional', 'Internacional'];
  tipo_transporte: any = ['Ida', 'Vuelta'];
  hotels: any = [];
  hotels_inter: any = [];
  people: any[] = [];
  person_selected: any;
  form: UntypedFormGroup;
  value: any;
  public acomodation_for_hotel: any[] = [];
  hotels_list: any[] = [];
  work_orders: any[] = [];

  constructor(
    private roter: Router,
    private _swal: SwalService,
    private fb: UntypedFormBuilder,
    private _viatico: CrearViaticosService,
  ) {}

  async ngOnInit() {
    if (!this.title) this.title = 'Crear viático';
    this.createForm();
    this.getPeople();
    this.getRouteTaxi();
    this.getCity();
    await this.getHotels();
    this.validateData();
  }

  getCity() {
    this._viatico.getCity().subscribe((r: any) => {
      this.city = r.data;
    });
  }

  getPeople() {
    this._viatico.getPeople().subscribe((res: any) => {
      this.people = res.map((data) => {
        data.text = data.full_name;
        data.value = data.id;
        return data;
      });
    });
  }

  onSetOfficer() {
    const id = this.form.get('travel').get('person_id').value;
    this.func = this.people.find((r) => r.id == id);
  }

  createForm() {
    this.form = help.functions.createForm(this.fb);
    help.functions.listerTotal(this.form);
  }

  validateData() {
    if (this.data) {
      help.functions.fillInForm(this.form, this.data, this.fb);
      this.func = this.data;
    }
  }
  getBasicControl(): UntypedFormGroup {
    let group = help.hospedajeHelper.createHotelGroup(this.fb);
    help.hospedajeHelper.subscribeHospedaje(group, this.form, this.hospedajeList);
    return group;
  }

  async getHotels() {
    await this._viatico
      .getHotels()
      .toPromise()
      .then((res: any) => {
        this.hotels_list = Array.from(new Set([...res.data.nacional, ...res.data.internacional]));
        help.hospedajeHelper.consts.national_hotels = res.data.nacional;
        help.hospedajeHelper.consts.international_hotels = res.data.internacional;
      });
  }

  newHospedaje() {
    let hospedaje = this.hospedajeList;
    hospedaje.push(this.getBasicControl());
  }

  get hospedajeList() {
    return this.form.get('hospedaje') as UntypedFormArray;
  }

  deleteHospedaje(i) {
    this.hospedajeList.removeAt(this.hospedajeList.length - 1);
    help.hospedajeHelper.getTotalHospedaje(this.form, this.hospedajeList);
  }

  changeTipo(res, control: UntypedFormControl) {
    control.patchValue({
      hoteles:
        res == 'Nacional'
          ? help.hospedajeHelper.consts.national_hotels
          : help.hospedajeHelper.consts.international_hotels,
    });
  }

  seleccionHotel(e, item) {
    this.hotels_list.forEach((element) => {
      if (element.id == e.target.value) {
        this.acomodation_for_hotel = element.accommodations;
        //help.hospedajeHelper.consts.acomodationForHotel = element.accommodations
      }
    });
    this.actualizaTipAlojam(item);
  }

  actualizaTipAlojam(item) {
    item.get('accommodation').valueChanges.subscribe((r) => {
      let rate = this.acomodation_for_hotel.find((e) => e.id == r);
      item.patchValue({
        rate: rate.pivot.price,
      });
    });
  }

  /***************** TRANSPORTE TERRESTRE ****************/

  getTransporteControl(): UntypedFormGroup {
    let group = help.transporteHelper.createGroup(this.fb);
    help.transporteHelper.createListener(
      group,
      this.form,
      this.transporteList,
      'total_transports_cop',
    );
    return group;
  }

  get transporteList() {
    return this.form.get('transporte') as UntypedFormArray;
  }

  newTransporte() {
    let transporte = this.transporteList;
    transporte.push(this.getTransporteControl());
  }

  deleteTransporte(i) {
    this.transporteList.removeAt(this.transporteList.length - 1);
    help.transporteHelper.getTotal(this.form, this.transporteList, 'total_transports_cop');
  }

  /***************** AIR TRANSPORT ****************/

  setAirTransport(): FormGroup {
    let group = help.transporteHelper.createGroup(this.fb);
    help.transporteHelper.createListener(
      group,
      this.form,
      this.airTransportList,
      'total_air_transport_cop',
    );
    return group;
  }

  get airTransportList() {
    return this.form.get('air') as FormArray;
  }

  addAirTransport() {
    this.airTransportList.push(this.setAirTransport());
  }

  deleteAirTransport() {
    this.airTransportList.removeAt(this.airTransportList.length - 1);
    help.transporteHelper.getTotal(this.form, this.airTransportList, 'total_air_transport_cop');
  }

  getTaxisControl(): UntypedFormGroup {
    let group = help.taxiHelper.createGroup(this.fb, this.form, this.taxiList);
    return group;
  }

  get taxiList() {
    return this.form.get('taxi') as UntypedFormArray;
  }
  getCities() {
    this._viatico.getCity();
  }

  getRouteTaxi() {
    this._viatico.getRouteTaxi().subscribe((res: any) => {
      help.taxiHelper.consts.taxis = res.data;
    });
  }

  newTaxi() {
    let taxi = this.taxiList;
    taxi.push(this.getTaxisControl());
  }

  deleteTaxi(i) {
    this.taxiList.removeAt(this.taxiList.length - 1);
    this.getTotalTaxi();
  }

  getTotalTaxi() {
    help.taxiHelper.changeTotal(this.form, this.taxiList);
  }

  get FeedingList() {
    return this.form.get('feeding') as UntypedFormArray;
  }

  newFeeding() {
    let group = help.alimHelper.createGroup(this.fb, this.form);
    help.alimHelper.createListener(group, this.form, this.FeedingList);
    this.FeedingList.push(group);
  }

  deleteFeeding(i) {
    this.FeedingList.removeAt(this.FeedingList.length - 1);
    help.alimHelper.getTotal(this.form, this.FeedingList);
  }

  sumarTotal() {
    help.functions.sumarTotal(this.form);
  }

  crearViatico() {
    const request = () => {
      this.form.patchValue({
        work_order_id: this.form.get('work_order_id').value,
      });
      if (this.id) {
        this._viatico
          .actualizarViatico(this.id, this.form.value)
          .subscribe(this.handleCreateTravel());
      } else {
        this._viatico.crearViatico(this.form.value).subscribe(this.handleCreateTravel());
      }
    };
    this._swal.swalLoading(
      `Vamos a ${this.id ? 'editar' : 'crear'} una solicitud de viático`,
      request,
    );
  }

  private handleCreateTravel() {
    return {
      next: () => {
        this._swal.show({
          icon: 'success',
          text: `Viático  ${this.id ? 'editado' : 'creado'} con éxito`,
          title: 'Operación exitosa',
          showCancel: false,
          timer: 1000,
        });
        this.roter.navigateByUrl('/nomina/viaticos');
      },
      error: (err) => {
        this._swal.show({
          icon: 'error',
          title: '¡Ooops!',
          showCancel: false,
          text: err.code,
        });
      },
    };
  }
}

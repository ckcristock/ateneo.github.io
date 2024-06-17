import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { taxiHelper } from './taxi';
import { hospedajeHelper } from './hospedaje';
import { transporteHelper } from './trasporte';
import { alimHelper } from './alim';

export const functions = {
  consts: {},
  fillInForm(form: UntypedFormGroup, data, fb: UntypedFormBuilder) {
    form.get('travel').patchValue({
      person_id: parseInt(data.person_id),
      origin_id: parseInt(data.origin_id),
      travel_type: data.travel_type,
      destinity_id: parseInt(data.destinity_id),
      departure_date: data.departure_date,
      arrival_date: data.arrival_date,
      n_nights: parseInt(data.n_nights),
    });
    form.patchValue({
      other_expenses_cop: data.other_expenses_cop,
      other_expenses_usd: data.other_expenses_usd,
      observation: data.observation,
      baggage_usd: data.baggage_usd,
      baggage_cop: data.baggage_cop,
      total_laundry_cop: data.total_laundry_cop,
      total_laundry_usd: data.total_laundry_usd,
      work_order_id: data.work_order,
    });

    hospedajeHelper.createFillHotel(form, fb, data);
    transporteHelper.createFillTransport(form, fb, data);
    taxiHelper.createFillTaxis(form, fb, data);
    alimHelper.createFillHotel(form, fb, data);
  },

  fillInPerson(data) {
    let func: any = {};
    func = data.person;
    func.position = data.person.contractultimate.position.name;
    func.type = 'Funcionario';
    return func;
  },

  createForm(fb: UntypedFormBuilder) {
    return fb.group({
      other_expenses_usd: 0,
      other_expenses_cop: 0,
      baggage_usd: 0,
      baggage_cop: [0],
      total_hotels_usd: [0],
      total_hotels_cop: [0],
      total_transports_cop: [0],
      total_air_transport_cop: [0],
      total_taxis_usd: [0],
      total_taxis_cop: [0],
      total_feedings_usd: [0],
      total_feedings_cop: [0],
      total_laundry_cop: [0],
      total_laundry_usd: [0],
      total_usd: [0],
      total_cop: [0],
      work_order_id: [''],
      observation: [''],
      travel: fb.group({
        person_id: [null, Validators.required],
        origin_id: [null, Validators.required],
        destinity_id: [null, Validators.required],
        travel_type: ['', Validators.required],
        departure_date: ['', Validators.required],
        arrival_date: ['', Validators.required],
        n_nights: [null, Validators.required],
      }),
      hospedaje: fb.array([]),
      transporte: fb.array([]),
      air: fb.array([]),
      taxi: fb.array([]),
      feeding: fb.array([]),
    });
  },

  sumarTotal(form: UntypedFormGroup) {
    setTimeout(() => {
      let forma = form.value;
      let total_cop =
        parseFloat(forma.total_hotels_cop) +
        parseFloat(forma.total_transports_cop) +
        parseFloat(forma.total_air_transport_cop) +
        parseFloat(forma.total_feedings_cop) +
        parseFloat(forma.total_taxis_cop) +
        parseFloat(forma.baggage_cop) +
        parseFloat(forma.total_laundry_cop) +
        parseFloat(forma.other_expenses_cop);
      let total_usd =
        parseFloat(forma.total_hotels_usd) +
        parseFloat(forma.total_feedings_usd) +
        parseFloat(forma.total_laundry_usd) +
        parseFloat(forma.baggage_usd) +
        parseFloat(forma.total_taxis_usd) +
        parseFloat(forma.other_expenses_usd);
      form.patchValue({
        total_cop,
        total_usd,
      });
    }, 130);
  },

  listerTotal(form: UntypedFormGroup): void {
    form.get('other_expenses_cop').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('other_expenses_usd').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_hotels_cop').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_transports_cop').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_air_transport_cop').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_feedings_cop').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_taxis_cop').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_hotels_usd').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_feedings_usd').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_taxis_usd').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_laundry_usd').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('total_laundry_cop').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('baggage_cop').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
    form.get('baggage_usd').valueChanges.subscribe((r) => {
      this.sumarTotal(form);
    });
  },
};

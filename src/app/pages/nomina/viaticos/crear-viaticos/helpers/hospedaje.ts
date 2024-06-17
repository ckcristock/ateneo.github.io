import { functions } from './helper';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';

export const hospedajeHelper = {
  consts: {
    national_hotels: [],
    international_hotels: [],
  },
  createFillHotel(form: UntypedFormGroup, fb: UntypedFormBuilder, data) {
    if (data.hotels) {
      let hospedaje = form.get('hospedaje') as UntypedFormArray;
      data.hotels.forEach((r, i) => {
        let group = fb.group({
          tipo: [r.type],
          hotel_id: [r.id],
          phone: [r.phone],
          accommodation: [r.pivot.accommodation],
          rate: [r?.pivot?.rate],
          hoteles: [
            r.type == 'Nacional' ? this.consts.national_hotels : this.consts.international_hotels,
          ],
          i,
          address: [r.address],
          n_night: [r.pivot.n_night],
          total: [r.pivot.total],
          breakfast: [r.pivot.breakfast],
          who_cancels: [r.pivot.who_cancels],
          acomodationForHotel: [r.accommodations],
        });
        this.subscribeHospedaje(group, form, hospedaje);
        hospedaje.push(group);
      });
      this.getTotalHospedaje(form, hospedaje);
    }
  },

  createHotelGroup(fb: UntypedFormBuilder) {
    return fb.group({
      tipo: ['Selecciona'],
      hotel_id: [''],
      phone: [],
      rate: [0],
      hoteles: [],
      address: [],
      n_night: [0],
      total: [0],
      breakfast: [],
      who_cancels: [],
      accommodation: [''],
      acomodationForHotel: [],
    });
  },

  subscribeHospedaje(group: UntypedFormGroup, form: UntypedFormGroup, list: UntypedFormArray) {
    group.get('hotel_id').valueChanges.subscribe((value) => {
      let hotel = group.get('hoteles').value.find((res) => res.id == value);
      group.patchValue({
        address: hotel.address,
        phone: hotel.phone,
        breakfast: hotel.breakfast,
        acomodationForHotel: hotel.accommodations,
      });
    });
    group.get('n_night').valueChanges.subscribe((value) => {
      this.subtotalHotel(group, value, group.value.rate, form, list);
    });
    /* group.get('accommodation').valueChanges.subscribe((value) => {
      let hotel = group
        .get('hoteles')
        .value.find((res) => res.accommodation == value);
      group.patchValue({
        rate: value == 'Sencilla' ? hotel.simple_rate : hotel.double_rate,
      });
    }); */
    group.get('rate').valueChanges.subscribe((value) => {
      this.subtotalHotel(group, value, group.value.n_night, form, list);
    });
    group.get('n_night').valueChanges.subscribe((value) => {
      this.subtotalHotel(group, value, group.value.rate, form, list);
    });
    /* group.get('who_cancels').valueChanges.subscribe((value) => {
      if (value == 'agencia') {
        form.patchValue({
          total_hotels_cop: 0,
          total_hotels_usd: 0,
        })
      } else {
        this.subtotalHotel(group, group.value.n_night, group.value.rate, form, list);
      }
    }); */
  },

  subtotalHotel(
    group: UntypedFormGroup,
    val1: number,
    val2: number,
    form: UntypedFormGroup,
    list: UntypedFormArray,
  ) {
    group.patchValue({ total: val1 * val2 });
    hospedajeHelper.getTotalHospedaje(form, list);
  },

  getTotalHospedaje(form: UntypedFormGroup, list: UntypedFormArray) {
    let total = list.value.reduce(
      (a, b) => {
        if (b.tipo == 'Nacional') {
          return { inter: a.inter, nac: a.nac + b.total };
        } else {
          return { nac: a.nac, inter: a.inter + b.total };
        }
      },
      { nac: 0, inter: 0 },
    );
    form.patchValue({
      total_hotels_cop: total.nac,
      total_hotels_usd: total.inter,
    });
  },
};

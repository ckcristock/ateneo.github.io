import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

export const transporteHelper = {
  createFillTransport(form: UntypedFormGroup, fb: UntypedFormBuilder, data) {
    const setTransportData = (r) => {
      return fb.group({
        ticket_payment: [r.ticket_payment],
        type: [r.type],
        journey: [r.journey],
        company: [r.company],
        departure_date: [r.departure_date],
        ticket_value: [r.ticket_value],
      });
    };
    if (data.transports) {
      let transports = form.get('transporte') as UntypedFormArray;
      data.transports.forEach((r) => {
        let group = setTransportData(r);
        this.createListener(group, form, transports, 'total_transports_cop');
        transports.push(group);
      });
      this.getTotal(form, transports, 'total_transports_cop');
    }
    if (data.air_transports) {
      let transports = form.get('air') as UntypedFormArray;
      data.air_transports.forEach((r) => {
        let group = setTransportData(r);
        this.createListener(group, form, transports, 'total_air_transport_cop');
        transports.push(group);
      });
      this.getTotal(form, transports, 'total_air_transport_cop');
    }
  },

  createGroup(fb: UntypedFormBuilder): UntypedFormGroup {
    return fb.group({
      type: ['Ida'],
      journey: [],
      company: [],
      ticket_payment: [],
      departure_date: [],
      ticket_value: [0],
    });
  },
  createListener(
    group: UntypedFormGroup,
    form: UntypedFormGroup,
    list: UntypedFormArray,
    control: string,
  ) {
    group.get('ticket_value').valueChanges.subscribe((value) => {
      this.getTotal(form, list, control);
    });
    group.get('ticket_payment').valueChanges.subscribe((value) => {
      if (value == 'Agencia') {
        form.patchValue({
          [control]: 0,
        });
      } else {
        this.getTotal(form, list, control);
      }
    });
  },

  getTotal(form: UntypedFormGroup, list: UntypedFormArray, control: string) {
    setTimeout(() => {
      let total = list.controls.reduce((a, b) => {
        return a + b.value.ticket_value;
      }, 0);
      form.patchValue({
        [control]: total,
      });
    }, 50);
  },
};

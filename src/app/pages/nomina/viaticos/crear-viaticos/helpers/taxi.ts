import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
export const taxiHelper = {
  consts: {
    taxis: [],
  },
  createFillTaxis(form: UntypedFormGroup, fb: UntypedFormBuilder, data) {
    if (data.expense_taxi_cities) {
      let taxi = form.get('taxi') as UntypedFormArray;
      data.expense_taxi_cities.forEach((r) => {
        let taxi_cities = this.consts.taxis.find((d) => d.id == r.taxi_city.taxi.id).taxi_cities;
        let group = fb.group({
          journey: [this.consts.taxis],
          journey_id: [r.taxi_city.taxi.id],
          taxi_city_id: [r.taxi_city.id],
          city_selected: [r.taxi_city],
          taxi_cities: [taxi_cities],
          rate: [r.rate],
          journeys: [r.journeys],
          total: [r.total],
        });
        this.subscribeTaxi(group, form, taxi);
        taxi.push(group);
        return false;
      });

      this.changeTotal(form, taxi);
    }
  },

  createGroup(fb: UntypedFormBuilder, form: UntypedFormGroup, list: UntypedFormArray) {
    let group = fb.group({
      journey: [this.consts.taxis],
      journey_id: [],
      taxi_city_id: ['Seleccione'],
      city_selected: [],
      taxi_cities: [],
      rate: [0],
      journeys: [0],
      total: [0],
    });
    this.subscribeTaxi(group, form, list);
    return group;
  },

  changeTotal(form: UntypedFormGroup, list: UntypedFormArray) {
    let total = list.value.reduce(
      (a, b) => {
        if (b.city_selected.type == 'Nacional') {
          return { inter: a.inter, nac: a.nac + b.total };
        }
        return { nac: a.nac, inter: a.inter + b.total };
      },
      { nac: 0, inter: 0 },
    );

    form.patchValue({
      total_taxis_usd: total.inter,
      total_taxis_cop: total.nac,
    });
  },

  subscribeTaxi(group: UntypedFormGroup, form: UntypedFormGroup, list: UntypedFormArray) {
    group.get('rate').valueChanges.subscribe((value) => {
      let taxi = group.value;
      let totalTaxi = value * taxi.journeys;
      group.patchValue({
        total: totalTaxi,
      });
      this.changeTotal(form, list);
    });

    group.get('taxi_city_id').valueChanges.subscribe((value) => {
      let city_selected = group.get('taxi_cities').value.find((r) => r.id == value);

      group.patchValue({
        city_selected,
        rate: city_selected.value,
      });
    });
    group.get('journey_id').valueChanges.subscribe((value) => {
      let taxi_cities = this.consts.taxis.find((r) => r.id == value).taxi_cities;

      group.patchValue({
        taxi_cities,
        taxi_city_id: taxi_cities[0].id,
      });
    });
    group.get('journeys').valueChanges.subscribe((value) => {
      let taxi = group.value;
      let totalTaxi = value * taxi.rate;
      group.patchValue({
        total: totalTaxi,
      });
      this.changeTotal(form, list);
    });
  },
};

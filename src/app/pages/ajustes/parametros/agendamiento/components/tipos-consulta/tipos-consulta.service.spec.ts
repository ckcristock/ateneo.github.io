/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TiposConsultaService } from './tipos-consulta.service';

describe('Service: TiposConsulta', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TiposConsultaService],
    });
  });

  it('should ...', inject([TiposConsultaService], (service: TiposConsultaService) => {
    expect(service).toBeTruthy();
  }));
});

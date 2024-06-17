import { TestBed, inject } from '@angular/core/testing';

import { TiposervicioService } from './tiposervicio.service';

describe('TiposervicioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TiposervicioService],
    });
  });

  it('should be created', inject([TiposervicioService], (service: TiposervicioService) => {
    expect(service).toBeTruthy();
  }));
});

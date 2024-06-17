import { TestBed, inject } from '@angular/core/testing';

import { PuntodispensacionService } from './puntodispensacion.service';

describe('PuntodispensacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PuntodispensacionService],
    });
  });

  it('should be created', inject(
    [PuntodispensacionService],
    (service: PuntodispensacionService) => {
      expect(service).toBeTruthy();
    },
  ));
});

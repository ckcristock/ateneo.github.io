import { TestBed } from '@angular/core/testing';

import { HistorialDatosService } from './historial-datos.service';

describe('HistorialDatosService', () => {
  let service: HistorialDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

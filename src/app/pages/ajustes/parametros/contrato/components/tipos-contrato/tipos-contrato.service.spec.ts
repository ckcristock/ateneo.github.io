import { TestBed } from '@angular/core/testing';

import { TiposContratoService } from './tipos-contrato.service';

describe('TiposContratoService', () => {
  let service: TiposContratoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposContratoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

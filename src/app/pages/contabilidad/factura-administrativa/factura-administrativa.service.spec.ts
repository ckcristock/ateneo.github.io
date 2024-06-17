import { TestBed } from '@angular/core/testing';

import { FacturaAdministrativaService } from './factura-administrativa.service';

describe('FacturaAdministrativaService', () => {
  let service: FacturaAdministrativaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturaAdministrativaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TiposSalarioService } from './tipos-salario.service';

describe('TiposSalarioService', () => {
  let service: TiposSalarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposSalarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

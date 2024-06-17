import { TestBed } from '@angular/core/testing';

import { InventariosValorizadosService } from './inventarios-valorizados.service';

describe('InventariosValorizadosService', () => {
  let service: InventariosValorizadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventariosValorizadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

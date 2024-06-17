import { TestBed } from '@angular/core/testing';

import { NotasCarterasService } from './notas-carteras.service';

describe('NotasCarterasService', () => {
  let service: NotasCarterasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotasCarterasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

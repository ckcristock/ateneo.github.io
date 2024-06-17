import { TestBed } from '@angular/core/testing';

import { AlmuerzosService } from './almuerzos.service';

describe('AlmuerzosService', () => {
  let service: AlmuerzosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlmuerzosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

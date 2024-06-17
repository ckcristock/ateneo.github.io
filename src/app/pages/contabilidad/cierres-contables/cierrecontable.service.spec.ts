import { TestBed } from '@angular/core/testing';

import { CierrecontableService } from './cierrecontable.service';

describe('CierrecontableService', () => {
  let service: CierrecontableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CierrecontableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

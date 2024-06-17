import { TestBed } from '@angular/core/testing';

import { TabladepreciacionService } from './tabladepreciacion.service';

describe('TabladepreciacionService', () => {
  let service: TabladepreciacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabladepreciacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

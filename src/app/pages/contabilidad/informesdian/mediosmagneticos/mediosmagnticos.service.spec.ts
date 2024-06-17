import { TestBed } from '@angular/core/testing';

import { MediosmagnticosService } from './mediosmagnticos.service';

describe('MediosmagnticosService', () => {
  let service: MediosmagnticosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediosmagnticosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

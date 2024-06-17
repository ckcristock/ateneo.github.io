import { TestBed } from '@angular/core/testing';

import { CustometypeaheadService } from './custometypeahead.service';

describe('CustometypeaheadService', () => {
  let service: CustometypeaheadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustometypeaheadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

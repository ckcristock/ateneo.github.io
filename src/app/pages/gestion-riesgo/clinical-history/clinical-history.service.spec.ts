/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClinicalHistoryService } from './clinical-history.service';

describe('Service: ClinicalHistory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClinicalHistoryService],
    });
  });

  it('should ...', inject([ClinicalHistoryService], (service: ClinicalHistoryService) => {
    expect(service).toBeTruthy();
  }));
});

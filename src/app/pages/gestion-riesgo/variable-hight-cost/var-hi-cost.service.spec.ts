/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VarHiCostService } from './var-hi-cost.service';

describe('Service: VarHiCost', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VarHiCostService],
    });
  });

  it('should ...', inject([VarHiCostService], (service: VarHiCostService) => {
    expect(service).toBeTruthy();
  }));
});

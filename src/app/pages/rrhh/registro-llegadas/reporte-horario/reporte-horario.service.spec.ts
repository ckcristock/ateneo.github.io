import { TestBed } from '@angular/core/testing';

import { ReporteHorarioService } from './reporte-horario.service';

describe('ReporteHorarioService', () => {
  let service: ReporteHorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteHorarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

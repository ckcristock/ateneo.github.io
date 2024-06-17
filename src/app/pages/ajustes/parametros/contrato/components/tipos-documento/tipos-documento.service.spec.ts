import { TestBed } from '@angular/core/testing';

import { TiposDocumentoService } from './tipos-documento.service';

describe('TiposDocumentoService', () => {
  let service: TiposDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoretencionComponent } from './certificadoretencion.component';

describe('CertificadoretencionComponent', () => {
  let component: CertificadoretencionComponent;
  let fixture: ComponentFixture<CertificadoretencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificadoretencionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoretencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

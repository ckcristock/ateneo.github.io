import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoingresoyretencionComponent } from './certificadoingresoyretencion.component';

describe('CertificadoingresoyretencionComponent', () => {
  let component: CertificadoingresoyretencionComponent;
  let fixture: ComponentFixture<CertificadoingresoyretencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificadoingresoyretencionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoingresoyretencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

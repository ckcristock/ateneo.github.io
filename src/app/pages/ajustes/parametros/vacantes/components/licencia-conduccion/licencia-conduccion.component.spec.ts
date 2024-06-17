import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenciaConduccionComponent } from './licencia-conduccion.component';

describe('LicenciaConduccionComponent', () => {
  let component: LicenciaConduccionComponent;
  let fixture: ComponentFixture<LicenciaConduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenciaConduccionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenciaConduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

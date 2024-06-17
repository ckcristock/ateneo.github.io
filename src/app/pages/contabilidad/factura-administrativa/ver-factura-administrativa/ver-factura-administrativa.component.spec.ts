import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFacturaAdministrativaComponent } from './ver-factura-administrativa.component';

describe('VerFacturaAdministrativaComponent', () => {
  let component: VerFacturaAdministrativaComponent;
  let fixture: ComponentFixture<VerFacturaAdministrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerFacturaAdministrativaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerFacturaAdministrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

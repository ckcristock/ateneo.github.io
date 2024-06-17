import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaAdministrativaComponent } from './factura-administrativa.component';

describe('FacturaAdministrativaComponent', () => {
  let component: FacturaAdministrativaComponent;
  let fixture: ComponentFixture<FacturaAdministrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaAdministrativaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaAdministrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

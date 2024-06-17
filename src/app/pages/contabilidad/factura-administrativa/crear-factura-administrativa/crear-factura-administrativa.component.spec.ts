import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFacturaAdministrativaComponent } from './crear-factura-administrativa.component';

describe('CrearFacturaAdministrativaComponent', () => {
  let component: CrearFacturaAdministrativaComponent;
  let fixture: ComponentFixture<CrearFacturaAdministrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearFacturaAdministrativaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFacturaAdministrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

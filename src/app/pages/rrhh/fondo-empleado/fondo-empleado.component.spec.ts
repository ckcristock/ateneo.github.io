import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FondoEmpleadoComponent } from './fondo-empleado.component';

describe('FondoEmpleadoComponent', () => {
  let component: FondoEmpleadoComponent;
  let fixture: ComponentFixture<FondoEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FondoEmpleadoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FondoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

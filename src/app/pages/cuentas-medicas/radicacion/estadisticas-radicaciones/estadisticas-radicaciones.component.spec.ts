import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasRadicacionesComponent } from './estadisticas-radicaciones.component';

describe('EstadisticasRadicacionesComponent', () => {
  let component: EstadisticasRadicacionesComponent;
  let fixture: ComponentFixture<EstadisticasRadicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasRadicacionesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticasRadicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

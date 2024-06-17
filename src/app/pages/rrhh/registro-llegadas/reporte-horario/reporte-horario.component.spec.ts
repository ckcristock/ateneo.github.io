import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteHorarioComponent } from './reporte-horario.component';

describe('ReporteHorarioComponent', () => {
  let component: ReporteHorarioComponent;
  let fixture: ComponentFixture<ReporteHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteHorarioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

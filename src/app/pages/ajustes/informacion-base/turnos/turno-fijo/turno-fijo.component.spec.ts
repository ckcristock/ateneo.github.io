import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoFijoComponent } from './turno-fijo.component';

describe('TurnoFijoComponent', () => {
  let component: TurnoFijoComponent;
  let fixture: ComponentFixture<TurnoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoFijoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

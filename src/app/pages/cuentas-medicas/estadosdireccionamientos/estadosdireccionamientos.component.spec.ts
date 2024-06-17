import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosdireccionamientosComponent } from './estadosdireccionamientos.component';

describe('EstadosdireccionamientosComponent', () => {
  let component: EstadosdireccionamientosComponent;
  let fixture: ComponentFixture<EstadosdireccionamientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EstadosdireccionamientosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadosdireccionamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

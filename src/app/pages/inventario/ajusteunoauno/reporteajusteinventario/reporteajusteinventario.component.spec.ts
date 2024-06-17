import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteajusteinventarioComponent } from './reporteajusteinventario.component';

describe('ReporteajusteinventarioComponent', () => {
  let component: ReporteajusteinventarioComponent;
  let fixture: ComponentFixture<ReporteajusteinventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReporteajusteinventarioComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteajusteinventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

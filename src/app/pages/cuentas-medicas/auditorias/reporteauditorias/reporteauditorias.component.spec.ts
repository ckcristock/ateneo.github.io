import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteauditoriasComponent } from './reporteauditorias.component';

describe('ReporteauditoriasComponent', () => {
  let component: ReporteauditoriasComponent;
  let fixture: ComponentFixture<ReporteauditoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReporteauditoriasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteauditoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

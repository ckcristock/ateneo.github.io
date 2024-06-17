import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaproductoscontrolcantidadComponent } from './tablaproductoscontrolcantidad.component';

describe('TablaproductoscontrolcantidadComponent', () => {
  let component: TablaproductoscontrolcantidadComponent;
  let fixture: ComponentFixture<TablaproductoscontrolcantidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TablaproductoscontrolcantidadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaproductoscontrolcantidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

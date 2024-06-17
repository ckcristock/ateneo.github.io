import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioReconteoComponent } from './inventario-reconteo.component';

describe('InventarioReconteoComponent', () => {
  let component: InventarioReconteoComponent;
  let fixture: ComponentFixture<InventarioReconteoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioReconteoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioReconteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

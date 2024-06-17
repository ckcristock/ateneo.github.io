import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerdetalledevolucionComponent } from './verdetalledevolucion.component';

describe('VerdetalledevolucionComponent', () => {
  let component: VerdetalledevolucionComponent;
  let fixture: ComponentFixture<VerdetalledevolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [VerdetalledevolucionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerdetalledevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablafacturacionComponent } from './tablafacturacion.component';

describe('TablafacturacionComponent', () => {
  let component: TablafacturacionComponent;
  let fixture: ComponentFixture<TablafacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TablafacturacionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablafacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposervicioscrearComponent } from './tiposervicioscrear.component';

describe('TiposervicioscrearComponent', () => {
  let component: TiposervicioscrearComponent;
  let fixture: ComponentFixture<TiposervicioscrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TiposervicioscrearComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposervicioscrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

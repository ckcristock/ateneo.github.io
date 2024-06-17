import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispensacionesComponent } from './dispensaciones.component';

describe('DispensacionesComponent', () => {
  let component: DispensacionesComponent;
  let fixture: ComponentFixture<DispensacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DispensacionesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispensacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

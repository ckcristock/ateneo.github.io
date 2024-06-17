import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispensacionauditoriaComponent } from './dispensacionauditoria.component';

describe('DispensacionauditoriaComponent', () => {
  let component: DispensacionauditoriaComponent;
  let fixture: ComponentFixture<DispensacionauditoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DispensacionauditoriaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispensacionauditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

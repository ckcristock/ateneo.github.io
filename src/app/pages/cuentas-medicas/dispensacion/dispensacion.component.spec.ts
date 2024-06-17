import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispensacionComponent } from './dispensacion.component';

describe('DispensacionComponent', () => {
  let component: DispensacionComponent;
  let fixture: ComponentFixture<DispensacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DispensacionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispensacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

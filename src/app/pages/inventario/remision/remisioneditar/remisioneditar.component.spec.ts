import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisioneditarComponent } from './remisioneditar.component';

describe('RemisioneditarComponent', () => {
  let component: RemisioneditarComponent;
  let fixture: ComponentFixture<RemisioneditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RemisioneditarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemisioneditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

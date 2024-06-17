import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediomagneticoagrupacioncrearComponent } from './mediomagneticoagrupacioncrear.component';

describe('MediomagneticoagrupacioncrearComponent', () => {
  let component: MediomagneticoagrupacioncrearComponent;
  let fixture: ComponentFixture<MediomagneticoagrupacioncrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediomagneticoagrupacioncrearComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediomagneticoagrupacioncrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

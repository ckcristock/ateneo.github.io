import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediomagneticocrearComponent } from './mediomagneticocrear.component';

describe('MediomagneticocrearComponent', () => {
  let component: MediomagneticocrearComponent;
  let fixture: ComponentFixture<MediomagneticocrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediomagneticocrearComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediomagneticocrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediomagagrupadosespComponent } from './mediomagagrupadosesp.component';

describe('MediomagagrupadosespComponent', () => {
  let component: MediomagagrupadosespComponent;
  let fixture: ComponentFixture<MediomagagrupadosespComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediomagagrupadosespComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediomagagrupadosespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

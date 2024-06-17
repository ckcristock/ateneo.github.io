import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediosmagneticosComponent } from './mediosmagneticos.component';

describe('MediosmagneticosComponent', () => {
  let component: MediosmagneticosComponent;
  let fixture: ComponentFixture<MediosmagneticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediosmagneticosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediosmagneticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteingresocrearComponent } from './comprobanteingresocrear.component';

describe('ComprobanteingresocrearComponent', () => {
  let component: ComprobanteingresocrearComponent;
  let fixture: ComponentFixture<ComprobanteingresocrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprobanteingresocrearComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteingresocrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorradorcomprobantesComponent } from './borradorcomprobantes.component';

describe('BorradorcomprobantesComponent', () => {
  let component: BorradorcomprobantesComponent;
  let fixture: ComponentFixture<BorradorcomprobantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorradorcomprobantesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BorradorcomprobantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

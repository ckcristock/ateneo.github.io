import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportekardexComponent } from './reportekardex.component';

describe('ReportekardexComponent', () => {
  let component: ReportekardexComponent;
  let fixture: ComponentFixture<ReportekardexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReportekardexComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportekardexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedireccionaminetoComponent } from './reportedireccionamineto.component';

describe('ReportedireccionaminetoComponent', () => {
  let component: ReportedireccionaminetoComponent;
  let fixture: ComponentFixture<ReportedireccionaminetoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReportedireccionaminetoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedireccionaminetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

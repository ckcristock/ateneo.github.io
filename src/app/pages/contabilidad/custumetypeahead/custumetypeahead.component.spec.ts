import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustumetypeaheadComponent } from './custumetypeahead.component';

describe('CustumetypeaheadComponent', () => {
  let component: CustumetypeaheadComponent;
  let fixture: ComponentFixture<CustumetypeaheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustumetypeaheadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustumetypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailClinicalHistoryComponent } from './detail-clinical-history.component';

describe('DetailClinicalHistoryComponent', () => {
  let component: DetailClinicalHistoryComponent;
  let fixture: ComponentFixture<DetailClinicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailClinicalHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailClinicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

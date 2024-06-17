import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanasExtrasComponent } from './semanas-extras.component';

describe('SemanasExtrasComponent', () => {
  let component: SemanasExtrasComponent;
  let fixture: ComponentFixture<SemanasExtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemanasExtrasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanasExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

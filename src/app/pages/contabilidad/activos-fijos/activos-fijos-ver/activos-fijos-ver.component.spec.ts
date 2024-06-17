import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivosFijosVerComponent } from './activos-fijos-ver.component';

describe('ActivosFijosVerComponent', () => {
  let component: ActivosFijosVerComponent;
  let fixture: ComponentFixture<ActivosFijosVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivosFijosVerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivosFijosVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

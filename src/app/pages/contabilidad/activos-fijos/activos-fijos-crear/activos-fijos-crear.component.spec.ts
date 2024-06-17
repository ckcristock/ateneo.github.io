import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivosFijosCrearComponent } from './activos-fijos-crear.component';

describe('ActivosFijosCrearComponent', () => {
  let component: ActivosFijosCrearComponent;
  let fixture: ComponentFixture<ActivosFijosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivosFijosCrearComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivosFijosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

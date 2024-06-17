import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlistamientoCrearComponent } from './alistamiento-crear.component';

describe('AlistamientoCrearComponent', () => {
  let component: AlistamientoCrearComponent;
  let fixture: ComponentFixture<AlistamientoCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlistamientoCrearComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlistamientoCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

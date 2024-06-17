import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionamientosComponent } from './direccionamientos.component';

describe('DireccionamientosComponent', () => {
  let component: DireccionamientosComponent;
  let fixture: ComponentFixture<DireccionamientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DireccionamientosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DireccionamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

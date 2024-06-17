import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcierrecontableComponent } from './modalcierrecontable.component';

describe('ModalcierrecontableComponent', () => {
  let component: ModalcierrecontableComponent;
  let fixture: ComponentFixture<ModalcierrecontableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalcierrecontableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcierrecontableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

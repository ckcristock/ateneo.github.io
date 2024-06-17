import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCupComponent } from './modal-cup.component';

describe('ModalCupComponent', () => {
  let component: ModalCupComponent;
  let fixture: ComponentFixture<ModalCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

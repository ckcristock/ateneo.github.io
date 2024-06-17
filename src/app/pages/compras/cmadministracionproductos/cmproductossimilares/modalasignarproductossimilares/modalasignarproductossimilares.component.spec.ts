import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalasignarproductossimilaresComponent } from './modalasignarproductossimilares.component';

describe('ModalasignarproductossimilaresComponent', () => {
  let component: ModalasignarproductossimilaresComponent;
  let fixture: ComponentFixture<ModalasignarproductossimilaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ModalasignarproductossimilaresComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalasignarproductossimilaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

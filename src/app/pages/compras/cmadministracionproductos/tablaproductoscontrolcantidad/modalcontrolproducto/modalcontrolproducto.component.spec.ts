import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcontrolproductoComponent } from './modalcontrolproducto.component';

describe('ModalcontrolproductoComponent', () => {
  let component: ModalcontrolproductoComponent;
  let fixture: ComponentFixture<ModalcontrolproductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ModalcontrolproductoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcontrolproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

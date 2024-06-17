import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalproductoremisionnuevoComponent } from './modalproductoremisionnuevo.component';

describe('ModalproductoremisionnuevoComponent', () => {
  let component: ModalproductoremisionnuevoComponent;
  let fixture: ComponentFixture<ModalproductoremisionnuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ModalproductoremisionnuevoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalproductoremisionnuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

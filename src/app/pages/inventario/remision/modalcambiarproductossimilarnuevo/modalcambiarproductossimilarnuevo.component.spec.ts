import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcambiarproductossimilarnuevoComponent } from './modalcambiarproductossimilarnuevo.component';

describe('ModalcambiarproductossimilarnuevoComponent', () => {
  let component: ModalcambiarproductossimilarnuevoComponent;
  let fixture: ComponentFixture<ModalcambiarproductossimilarnuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ModalcambiarproductossimilarnuevoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcambiarproductossimilarnuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

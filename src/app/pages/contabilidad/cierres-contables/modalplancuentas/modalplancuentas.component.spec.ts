import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalplancuentasComponent } from './modalplancuentas.component';

describe('ModalplancuentasComponent', () => {
  let component: ModalplancuentasComponent;
  let fixture: ComponentFixture<ModalplancuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalplancuentasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalplancuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

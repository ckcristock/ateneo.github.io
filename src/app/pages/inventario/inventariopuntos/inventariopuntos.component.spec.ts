import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariopuntosComponent } from './inventariopuntos.component';

describe('InventariopuntosComponent', () => {
  let component: InventariopuntosComponent;
  let fixture: ComponentFixture<InventariopuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InventariopuntosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariopuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioVencerComponent } from './inventario-vencer.component';

describe('InventarioVencerComponent', () => {
  let component: InventarioVencerComponent;
  let fixture: ComponentFixture<InventarioVencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioVencerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioVencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

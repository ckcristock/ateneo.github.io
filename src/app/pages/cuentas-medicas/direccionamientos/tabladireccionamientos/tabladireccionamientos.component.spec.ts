import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabladireccionamientosComponent } from './tabladireccionamientos.component';

describe('TabladireccionamientosComponent', () => {
  let component: TabladireccionamientosComponent;
  let fixture: ComponentFixture<TabladireccionamientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TabladireccionamientosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabladireccionamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

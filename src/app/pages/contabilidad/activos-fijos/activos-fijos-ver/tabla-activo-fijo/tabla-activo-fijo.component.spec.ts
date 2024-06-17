import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaActivoFijoComponent } from './tabla-activo-fijo.component';

describe('TablaActivoFijoComponent', () => {
  let component: TablaActivoFijoComponent;
  let fixture: ComponentFixture<TablaActivoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaActivoFijoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaActivoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

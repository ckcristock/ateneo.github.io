import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaproductossimilaresComponent } from './tablaproductossimilares.component';

describe('TablaproductossimilaresComponent', () => {
  let component: TablaproductossimilaresComponent;
  let fixture: ComponentFixture<TablaproductossimilaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TablaproductossimilaresComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaproductossimilaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionventasverComponent } from './facturacionventasver.component';

describe('FacturacionventasverComponent', () => {
  let component: FacturacionventasverComponent;
  let fixture: ComponentFixture<FacturacionventasverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FacturacionventasverComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionventasverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

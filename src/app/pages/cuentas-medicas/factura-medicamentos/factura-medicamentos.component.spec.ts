/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FacturaMedicamentosComponent } from './factura-medicamentos.component';

describe('FacturaMedicamentosComponent', () => {
  let component: FacturaMedicamentosComponent;
  let fixture: ComponentFixture<FacturaMedicamentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FacturaMedicamentosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

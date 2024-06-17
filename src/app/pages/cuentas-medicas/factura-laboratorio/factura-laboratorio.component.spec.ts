/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FacturaLaboratorioComponent } from './factura-laboratorio.component';

describe('FacturaLaboratorioComponent', () => {
  let component: FacturaLaboratorioComponent;
  let fixture: ComponentFixture<FacturaLaboratorioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FacturaLaboratorioComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

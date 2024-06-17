/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TablaFacturacionComponent } from './tabla-facturacion.component';

describe('TablaFacturacionComponent', () => {
  let component: TablaFacturacionComponent;
  let fixture: ComponentFixture<TablaFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TablaFacturacionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

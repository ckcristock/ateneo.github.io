/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FacturaPgpComponent } from './factura-pgp.component';

describe('FacturaPgpComponent', () => {
  let component: FacturaPgpComponent;
  let fixture: ComponentFixture<FacturaPgpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FacturaPgpComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaPgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

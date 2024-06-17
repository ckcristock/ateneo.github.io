/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FacturaCapitaComponent } from './factura-capita.component';

describe('FacturaCapitaComponent', () => {
  let component: FacturaCapitaComponent;
  let fixture: ComponentFixture<FacturaCapitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FacturaCapitaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaCapitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

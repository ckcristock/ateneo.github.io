/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NuevaFacturaCapitaComponent } from './nueva-factura-capita.component';

describe('NuevaFacturaCapitaComponent', () => {
  let component: NuevaFacturaCapitaComponent;
  let fixture: ComponentFixture<NuevaFacturaCapitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NuevaFacturaCapitaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaFacturaCapitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

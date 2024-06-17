/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormularioRadicacionComponent } from './formulario-radicacion.component';

describe('FormularioRadicacionComponent', () => {
  let component: FormularioRadicacionComponent;
  let fixture: ComponentFixture<FormularioRadicacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormularioRadicacionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioRadicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

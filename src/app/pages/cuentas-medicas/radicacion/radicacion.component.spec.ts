/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RadicacionComponent } from './radicacion.component';

describe('RadicacionComponent', () => {
  let component: RadicacionComponent;
  let fixture: ComponentFixture<RadicacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RadicacionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

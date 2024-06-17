/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TablaRadicacionesComponent } from './tabla-radicaciones.component';

describe('TablaRadicacionesComponent', () => {
  let component: TablaRadicacionesComponent;
  let fixture: ComponentFixture<TablaRadicacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TablaRadicacionesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRadicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

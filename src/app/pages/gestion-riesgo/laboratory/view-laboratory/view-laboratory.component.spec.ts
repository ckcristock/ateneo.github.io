/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViewLaboratoryComponent } from './view-laboratory.component';

describe('ViewLaboratoryComponent', () => {
  let component: ViewLaboratoryComponent;
  let fixture: ComponentFixture<ViewLaboratoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ViewLaboratoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLaboratoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

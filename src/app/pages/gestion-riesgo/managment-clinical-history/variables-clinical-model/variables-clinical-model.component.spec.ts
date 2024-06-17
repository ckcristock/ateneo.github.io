/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VariablesClinicalModelComponent } from './variables-clinical-model.component';

describe('VariablesClinicalModelComponent', () => {
  let component: VariablesClinicalModelComponent;
  let fixture: ComponentFixture<VariablesClinicalModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [VariablesClinicalModelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesClinicalModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VariableHightCostComponent } from './variable-hight-cost.component';

describe('VariableHightCostComponent', () => {
  let component: VariableHightCostComponent;
  let fixture: ComponentFixture<VariableHightCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [VariableHightCostComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableHightCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditClinicalModelComponent } from './edit-clinical-model.component';

describe('EditClinicalModelComponent', () => {
  let component: EditClinicalModelComponent;
  let fixture: ComponentFixture<EditClinicalModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EditClinicalModelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClinicalModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

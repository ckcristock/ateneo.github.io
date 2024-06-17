/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewClinicalHistoryComponent } from './new-clinical-history.component';

describe('NewClinicalHistoryComponent', () => {
  let component: NewClinicalHistoryComponent;
  let fixture: ComponentFixture<NewClinicalHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NewClinicalHistoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClinicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

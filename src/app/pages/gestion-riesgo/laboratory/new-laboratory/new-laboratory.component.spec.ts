/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewLaboratoryComponent } from './new-laboratory.component';

describe('NewLaboratoryComponent', () => {
  let component: NewLaboratoryComponent;
  let fixture: ComponentFixture<NewLaboratoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NewLaboratoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLaboratoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

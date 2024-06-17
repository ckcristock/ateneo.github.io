/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeepDetailComponent } from './deep-detail.component';

describe('DeepDetailComponent', () => {
  let component: DeepDetailComponent;
  let fixture: ComponentFixture<DeepDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DeepDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeepDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

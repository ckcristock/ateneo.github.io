import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjusteunoaunoComponent } from './ajusteunoauno.component';

describe('AjusteunoaunoComponent', () => {
  let component: AjusteunoaunoComponent;
  let fixture: ComponentFixture<AjusteunoaunoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AjusteunoaunoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjusteunoaunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

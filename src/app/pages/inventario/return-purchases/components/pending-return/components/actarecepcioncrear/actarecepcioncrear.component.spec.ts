import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActarecepcioncrearComponent } from './actarecepcioncrear.component';

describe('ActarecepcioncrearComponent', () => {
  let component: ActarecepcioncrearComponent;
  let fixture: ComponentFixture<ActarecepcioncrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ActarecepcioncrearComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActarecepcioncrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActarecepcionremisionverComponent } from './actarecepcionremisionver.component';

describe('ActarecepcionremisionverComponent', () => {
  let component: ActarecepcionremisionverComponent;
  let fixture: ComponentFixture<ActarecepcionremisionverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ActarecepcionremisionverComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActarecepcionremisionverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisioncrearnuevoComponent } from './remisioncrearnuevo.component';

describe('RemisioncrearnuevoComponent', () => {
  let component: RemisioncrearnuevoComponent;
  let fixture: ComponentFixture<RemisioncrearnuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RemisioncrearnuevoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemisioncrearnuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

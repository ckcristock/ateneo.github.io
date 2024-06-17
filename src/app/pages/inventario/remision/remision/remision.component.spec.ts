import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisionComponent } from './remision.component';

describe('RemisionComponent', () => {
  let component: RemisionComponent;
  let fixture: ComponentFixture<RemisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RemisionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

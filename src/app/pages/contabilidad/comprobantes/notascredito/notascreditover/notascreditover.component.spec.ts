import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotascreditoverComponent } from './notascreditover.component';

describe('NotascreditoverComponent', () => {
  let component: NotascreditoverComponent;
  let fixture: ComponentFixture<NotascreditoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotascreditoverComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotascreditoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

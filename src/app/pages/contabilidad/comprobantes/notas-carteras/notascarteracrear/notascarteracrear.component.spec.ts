import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotascarteracrearComponent } from './notascarteracrear.component';

describe('NotascarteracrearComponent', () => {
  let component: NotascarteracrearComponent;
  let fixture: ComponentFixture<NotascarteracrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotascarteracrearComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotascarteracrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

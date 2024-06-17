import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotascreditoComponent } from './notascredito.component';

describe('NotascreditoComponent', () => {
  let component: NotascreditoComponent;
  let fixture: ComponentFixture<NotascreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotascreditoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotascreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

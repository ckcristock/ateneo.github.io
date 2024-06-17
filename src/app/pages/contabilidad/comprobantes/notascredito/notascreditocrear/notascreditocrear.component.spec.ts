import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotascreditocrearComponent } from './notascreditocrear.component';

describe('NotascreditocrearComponent', () => {
  let component: NotascreditocrearComponent;
  let fixture: ComponentFixture<NotascreditocrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotascreditocrearComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotascreditocrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotascreditoverdefacturasComponent } from './notascreditoverdefacturas.component';

describe('NotascreditoverdefacturasComponent', () => {
  let component: NotascreditoverdefacturasComponent;
  let fixture: ComponentFixture<NotascreditoverdefacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NotascreditoverdefacturasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotascreditoverdefacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

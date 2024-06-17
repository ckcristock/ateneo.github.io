import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoinventariospuntosComponent } from './listadoinventariospuntos.component';

describe('ListadoinventariospuntosComponent', () => {
  let component: ListadoinventariospuntosComponent;
  let fixture: ComponentFixture<ListadoinventariospuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ListadoinventariospuntosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoinventariospuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesinventarioverComponent } from './ajustesinventariover.component';

describe('AjustesinventarioverComponent', () => {
  let component: AjustesinventarioverComponent;
  let fixture: ComponentFixture<AjustesinventarioverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AjustesinventarioverComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjustesinventarioverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

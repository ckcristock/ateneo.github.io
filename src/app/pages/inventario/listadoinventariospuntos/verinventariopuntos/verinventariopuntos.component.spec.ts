import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerinventariopuntosComponent } from './verinventariopuntos.component';

describe('VerinventariopuntosComponent', () => {
  let component: VerinventariopuntosComponent;
  let fixture: ComponentFixture<VerinventariopuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [VerinventariopuntosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerinventariopuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

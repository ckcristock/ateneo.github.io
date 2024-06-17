import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablafacturafaltanteComponent } from './tablafacturafaltante.component';

describe('TablafacturafaltanteComponent', () => {
  let component: TablafacturafaltanteComponent;
  let fixture: ComponentFixture<TablafacturafaltanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablafacturafaltanteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablafacturafaltanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

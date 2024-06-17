import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablafacturascargadasComponent } from './tablafacturascargadas.component';

describe('TablafacturascargadasComponent', () => {
  let component: TablafacturascargadasComponent;
  let fixture: ComponentFixture<TablafacturascargadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablafacturascargadasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablafacturascargadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

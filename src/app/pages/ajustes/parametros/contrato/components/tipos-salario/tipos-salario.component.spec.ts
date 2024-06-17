import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposSalarioComponent } from './tipos-salario.component';

describe('TiposSalarioComponent', () => {
  let component: TiposSalarioComponent;
  let fixture: ComponentFixture<TiposSalarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposSalarioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposSalarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

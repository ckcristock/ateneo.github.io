import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstructuraEmpresaComponent } from './estructura-empresa.component';

describe('EstructuraEmpresaComponent', () => {
  let component: EstructuraEmpresaComponent;
  let fixture: ComponentFixture<EstructuraEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstructuraEmpresaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstructuraEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

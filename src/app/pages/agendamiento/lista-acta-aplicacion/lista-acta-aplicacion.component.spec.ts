import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaActaAplicacionComponent } from './lista-acta-aplicacion.component';

describe('ListaActaAplicacionComponent', () => {
  let component: ListaActaAplicacionComponent;
  let fixture: ComponentFixture<ListaActaAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaActaAplicacionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaActaAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

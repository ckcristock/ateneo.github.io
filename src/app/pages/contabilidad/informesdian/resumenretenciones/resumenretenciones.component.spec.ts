import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenretencionesComponent } from './resumenretenciones.component';

describe('ResumenretencionesComponent', () => {
  let component: ResumenretencionesComponent;
  let fixture: ComponentFixture<ResumenretencionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenretencionesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenretencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

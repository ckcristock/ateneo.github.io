import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarHorasExtrasComponent } from './asignar-horas-extras.component';

describe('AsignarHorasExtrasComponent', () => {
  let component: AsignarHorasExtrasComponent;
  let fixture: ComponentFixture<AsignarHorasExtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarHorasExtrasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarHorasExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

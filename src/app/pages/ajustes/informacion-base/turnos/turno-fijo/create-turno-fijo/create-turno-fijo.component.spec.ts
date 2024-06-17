import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTurnoFijoComponent } from './create-turno-fijo.component';

describe('CreateTurnoFijoComponent', () => {
  let component: CreateTurnoFijoComponent;
  let fixture: ComponentFixture<CreateTurnoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTurnoFijoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTurnoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

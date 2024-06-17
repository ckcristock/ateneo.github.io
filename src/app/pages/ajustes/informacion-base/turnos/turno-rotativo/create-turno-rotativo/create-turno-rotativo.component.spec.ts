import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTurnoRotativoComponent } from './create-turno-rotativo.component';

describe('CreateTurnoRotativoComponent', () => {
  let component: CreateTurnoRotativoComponent;
  let fixture: ComponentFixture<CreateTurnoRotativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTurnoRotativoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTurnoRotativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

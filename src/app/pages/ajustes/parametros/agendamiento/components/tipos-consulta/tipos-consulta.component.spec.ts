import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposConsultaComponent } from './tipos-consulta.component';

describe('TiposConsultaComponent', () => {
  let component: TiposConsultaComponent;
  let fixture: ComponentFixture<TiposConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposConsultaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

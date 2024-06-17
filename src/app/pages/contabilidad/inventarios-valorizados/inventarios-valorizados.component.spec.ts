import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosValorizadosComponent } from './inventarios-valorizados.component';

describe('InventariosValorizadosComponent', () => {
  let component: InventariosValorizadosComponent;
  let fixture: ComponentFixture<InventariosValorizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventariosValorizadosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosValorizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

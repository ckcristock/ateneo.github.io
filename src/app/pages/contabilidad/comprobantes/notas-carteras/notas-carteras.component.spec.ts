import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasCarterasComponent } from './notas-carteras.component';

describe('NotasCarterasComponent', () => {
  let component: NotasCarterasComponent;
  let fixture: ComponentFixture<NotasCarterasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasCarterasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotasCarterasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

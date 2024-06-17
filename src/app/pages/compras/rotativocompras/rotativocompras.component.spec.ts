import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotativocomprasComponent } from './rotativocompras.component';

describe('RotativocomprasComponent', () => {
  let component: RotativocomprasComponent;
  let fixture: ComponentFixture<RotativocomprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RotativocomprasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotativocomprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

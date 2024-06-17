import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondenciasComponent } from './correspondencias.component';

describe('CorrespondenciasComponent', () => {
  let component: CorrespondenciasComponent;
  let fixture: ComponentFixture<CorrespondenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CorrespondenciasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

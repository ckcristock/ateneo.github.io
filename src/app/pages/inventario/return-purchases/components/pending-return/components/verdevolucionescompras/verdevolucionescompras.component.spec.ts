import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerdevolucionescomprasComponent } from './verdevolucionescompras.component';

describe('VerdevolucionescomprasComponent', () => {
  let component: VerdevolucionescomprasComponent;
  let fixture: ComponentFixture<VerdevolucionescomprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [VerdevolucionescomprasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerdevolucionescomprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

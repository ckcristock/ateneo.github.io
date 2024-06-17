import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmfacturacionComponent } from './cmfacturacion.component';

describe('CmfacturacionComponent', () => {
  let component: CmfacturacionComponent;
  let fixture: ComponentFixture<CmfacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CmfacturacionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmfacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

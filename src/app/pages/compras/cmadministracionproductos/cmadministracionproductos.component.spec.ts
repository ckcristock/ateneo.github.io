import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmadministracionproductosComponent } from './cmadministracionproductos.component';

describe('CmadministracionproductosComponent', () => {
  let component: CmadministracionproductosComponent;
  let fixture: ComponentFixture<CmadministracionproductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CmadministracionproductosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmadministracionproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmfacturaverComponent } from './cmfacturaver.component';

describe('CmfacturaverComponent', () => {
  let component: CmfacturaverComponent;
  let fixture: ComponentFixture<CmfacturaverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CmfacturaverComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmfacturaverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

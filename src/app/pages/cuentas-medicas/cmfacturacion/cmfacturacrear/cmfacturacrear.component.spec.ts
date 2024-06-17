import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmfacturacrearComponent } from './cmfacturacrear.component';

describe('CmfacturacrearComponent', () => {
  let component: CmfacturacrearComponent;
  let fixture: ComponentFixture<CmfacturacrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CmfacturacrearComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmfacturacrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

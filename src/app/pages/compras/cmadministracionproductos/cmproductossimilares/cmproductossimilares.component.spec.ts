import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmproductossimilaresComponent } from './cmproductossimilares.component';

describe('CmproductossimilaresComponent', () => {
  let component: CmproductossimilaresComponent;
  let fixture: ComponentFixture<CmproductossimilaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CmproductossimilaresComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmproductossimilaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

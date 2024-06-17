import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldataInitComponent } from './modaldata-init.component';

describe('ModaldataInitComponent', () => {
  let component: ModaldataInitComponent;
  let fixture: ComponentFixture<ModaldataInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaldataInitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldataInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

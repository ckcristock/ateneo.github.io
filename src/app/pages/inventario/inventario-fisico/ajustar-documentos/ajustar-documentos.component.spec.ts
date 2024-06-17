import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustarDocumentosComponent } from './ajustar-documentos.component';

describe('AjustarDocumentosComponent', () => {
  let component: AjustarDocumentosComponent;
  let fixture: ComponentFixture<AjustarDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustarDocumentosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjustarDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

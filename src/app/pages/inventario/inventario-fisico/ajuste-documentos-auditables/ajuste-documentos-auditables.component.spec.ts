import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjusteDocumentosAuditablesComponent } from './ajuste-documentos-auditables.component';

describe('AjusteDocumentosAuditablesComponent', () => {
  let component: AjusteDocumentosAuditablesComponent;
  let fixture: ComponentFixture<AjusteDocumentosAuditablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjusteDocumentosAuditablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjusteDocumentosAuditablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

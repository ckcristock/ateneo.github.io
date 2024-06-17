import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ContabilidadService } from './contabilidad.service';
import {
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { accountingTable } from './shared/components/accounting-table/accounting-table.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AccountingService } from './services/accounting.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.scss'],
  standalone: true,
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    accountingTable,
    NgbNavOutlet,
  ],
})
export class ContabilidadComponent implements OnChanges, OnInit {
  @Input() value!: string;
  activeTab = 1;
  accounts: any = [];
  retentionTypes: any = [];
  pagination: { page: number; pageSize: number; length: number } = {
    page: 1,
    pageSize: 100,
    length: 0,
  };
  public filtros: any = {};
  configurableEntityType: string | undefined;
  constructor(
    private _contabilidad: ContabilidadService,
    readonly UrlFiltersService: UrlFiltersService,
    private accountingService: AccountingService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    switch (this.value) {
      case 'subcategory':
        this.activeTab = 2;
        break;
      case 'product':
        this.activeTab = 3;
        break;
      default:
        this.activeTab = 1;
        break;
    }
  }

  ngOnInit(): void {
    this.getEntityTypefromRoute();
    this.getAccountingAccounts();
    this.getRetentionTypes();
  }

  getEntityTypefromRoute() {
    switch (this.value) {
      case 'subcategory':
        this.activeTab = 2;
        break;
      case 'product':
        this.activeTab = 3;
        break;
      default:
        this.activeTab = 1;
        break;
    }
  }

  getAccountingAccounts() {
    this._contabilidad.getAccountingAccounts().subscribe((r: any) => {
      this.accounts = r.data;
    });
  }

  getRetentionTypes() {
    this._contabilidad.getRetentionTypes().subscribe((r: any) => {
      this.retentionTypes = r.data;
    });
  }

  changeRoute(valueToSend: string) {
    this.value = valueToSend;
    switch (valueToSend) {
      case 'subcategory':
        this.router.navigate([`/ajustes/configuracion/contabilidad/${valueToSend}`], {
          queryParams: { value: valueToSend },
          queryParamsHandling: 'preserve',
        });
        this.activeTab = 2;
        break;
      case 'product':
        this.router.navigate([`/ajustes/configuracion/contabilidad/${valueToSend}`], {
          queryParams: { value: valueToSend },
          queryParamsHandling: 'preserve',
        });
        this.activeTab = 3;
        break;
      default:
        this.router.navigate([`/ajustes/configuracion/contabilidad/${valueToSend}`], {
          queryParams: { value: valueToSend },
          queryParamsHandling: 'preserve',
        });
        this.activeTab = 1;
        break;
    }
    console.log('this.value', this.value);
  }
}

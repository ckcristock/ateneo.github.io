import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { MatPaginator } from '@angular/material/paginator';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutocompleteFcComponent } from '@app/components/autocomplete-fc/autocomplete-fc.component';
import { ContabilidadService } from '@app/pages/ajustes/configuracion/contabilidad/contabilidad.service';
import { ModalBasicComponent } from '@shared/components/modal-basic/modal-basic.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { InputPositionInitialDirective } from '@app/core/directives/input-position-initial.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { consts } from 'src/app/core/utils/consts';
import { NotDataSaComponent } from '@app/components/not-data-sa/not-data-sa.component';
import { AccountingService } from '../../../services/accounting.service';

@Component({
  selector: 'app-accounting-table',
  standalone: true,
  templateUrl: './accounting-table.component.html',
  styleUrl: './accounting-table.component.scss',
  imports: [
    NotDataSaComponent,
    ModalBasicComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TableComponent,
    AutocompleteFcComponent,
    MatFormFieldModule,
    MatInputModule,
    ActionViewComponent,
    ActionDeactivateComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    InputPositionInitialDirective,
    NgxCurrencyDirective,
    AutomaticSearchComponent,
    CardComponent,
  ],
})
export class accountingTable implements OnInit {
  @Input() value!: string;
  @Input() activeTab!: number;
  @Input('accounts') accounts: any[] = [];
  @Input() configurable_entity_type: string = '';
  @ViewChild('itemModal') itemModal!: { hide: () => void; show: () => void };
  items: any = [];
  @Input('retentionTypes') retentionTypes: any[] = [];
  @HostBinding('class') classes = 'mt-3';
  active = 1;
  public loading: boolean = false;
  public loadingItem: boolean = false;
  viewModal: boolean = false;

  form!: UntypedFormGroup;
  formProducts!: UntypedFormGroup;
  masks = consts;
  pagination: { page: number; pageSize: number; length: number } = {
    page: 1,
    pageSize: 100,
    length: 0,
  };
  formsValuesChanged: boolean = false;
  entityTypefromService: any | undefined;
  itemName: string = '';
  filters = {
    name: '',
  };

  constructor(
    private _contabilidad: ContabilidadService,
    private fb: UntypedFormBuilder,
    private _user: UserService,
    private readonly _swal: SwalService,
    readonly UrlFiltersService: UrlFiltersService,
    private accountingService: AccountingService,
  ) {}

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

  ngOnInit(): void {
    this.getUrlParams();
    this.getItems();
    this.initFormProducts();
    if (this.configurable_entity_type !== 'product') {
      this.initCatSubcatForm();
    }
  }

  ngOnChange;

  initFormProducts() {
    this.formProducts = this.fb.group({
      id: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      income_account: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      inventory_account: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      expense_account: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      cost_account: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      entry_account: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      sale_iva_account: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      purchase_iva_account: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      retefuente_purchase_account: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      reteica_purchase_account: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  initCatSubcatForm() {
    this.form = this.fb.group(this.formProducts.value);
    this.form.addControl(
      'retention_type_id',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
    this.form.addControl(
      'sale_discount_account',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
    this.form.addControl(
      'purchase_discount_account',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
    this.form.addControl(
      'retefuente_sale_account',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
    this.form.addControl(
      'retefuente_percentage',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
    this.form.addControl(
      'reteica_sale_account',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
    this.form.addControl(
      'reteica_percentage',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
    this.form.addControl(
      'reteiva_sale_account',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
    this.form.addControl(
      'reteiva_purchase_account',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
    this.form.addControl(
      'reteiva_percentage',
      new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')]),
    );
  }

  closeModal() {
    if (this.form) {
      this.form.reset();
    }
    if (this.formProducts) {
      this.formProducts.reset();
    }
    this.itemModal.hide();
    this.viewModal = false;
    this.formsValuesChanged = false;
  }

  getRightForm() {
    return this.configurable_entity_type === 'product' ? this.formProducts.value : this.form.value;
  }

  getItems(paginacion: boolean = false) {
    this.loading = true;
    switch (this.configurable_entity_type) {
      case 'category':
        this.pagination = this.accountingService.getPaginationCategories();
        console.log('category getItems');
        break;
      case 'subcategory':
        this.pagination = this.accountingService.getPaginationSubcategories();
        console.log('subcategory getItems');
        break;
      case 'product':
        this.pagination = this.accountingService.getPaginationProducts();
        console.log('default getItems');
        break;
    }
    let params = {
      ...this.pagination,
      ...this.filters,
      configurable_entity_type: this.configurable_entity_type,
    };

    this._contabilidad.getItemsByEntityType(params).subscribe({
      next: (res: any) => {
        this.items = res?.data.data;
        this.pagination.length = res.data.total;
        console.log('this.pagination in getItems', this.pagination);

        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this._swal.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this._swal.incompleteError(formattedErrorMessage);
        }
      },
    });
    delete params.configurable_entity_type;
    this.UrlFiltersService.setUrlFilters(params, true);
  }

  getItemName(name: string) {
    this.itemName = name;
    console.log('itemName', this.itemName);
  }
  async editItem(item: any) {
    this.viewModal = true;
    this.itemModal.show();
    this.formsValuesChanged = true;
    this.loadingItem = true;
    console.log('item', item);
    this.getItemName(item?.configurable?.Nombre);
    await new Promise<void>((resolve) => {
      if (this.configurable_entity_type !== 'product') {
        this.form.patchValue({
          id: item?.id,
          retention_type_id: item.retention_type?.id,
          income_account: item.income_account?.Id_Plan_Cuentas,
          inventory_account: item.inventory_account?.Id_Plan_Cuentas,
          expense_account: item.expense_account?.Id_Plan_Cuentas,
          cost_account: item.cost_account?.Id_Plan_Cuentas,
          entry_account: item.entry_account?.Id_Plan_Cuentas,
          sale_iva_account: item.sale_iva_account?.Id_Plan_Cuentas,
          purchase_iva_account: item.purchase_iva_account?.Id_Plan_Cuentas,
          sale_discount_account: item.sale_discount_account?.Id_Plan_Cuentas,
          purchase_discount_account: item.purchase_discount_account?.Id_Plan_Cuentas,
          retefuente_sale_account: item.retefuente_sale_account?.Id_Plan_Cuentas,
          retefuente_purchase_account: item.Cuenta_Retefuente_Compra?.Id_Plan_Cuentas,
          retefuente_percentage: item.retefuente_percentage,
          reteica_sale_account: item.reteica_sale_account?.Id_Plan_Cuentas,
          reteica_purchase_account: item.reteica_purchase_account?.Id_Plan_Cuentas,
          reteica_percentage: item.reteica_percentage,
          reteiva_sale_account: item.reteiva_sale_account?.Id_Plan_Cuentas,
          reteiva_purchase_account: item.reteiva_purchase_account?.Id_Plan_Cuentas,
          reteiva_percentage: item.reteiva_percentage,
        });
      } else {
        this.formProducts.patchValue({
          id: item?.id,
          income_account: item.income_account?.Id_Plan_Cuentas,
          inventory_account: item.inventory_account?.Id_Plan_Cuentas,
          expense_account: item.expense_account?.Id_Plan_Cuentas,
          cost_account: item.cost_account?.Id_Plan_Cuentas,
          entry_account: item.entry_account?.Id_Plan_Cuentas,
          sale_iva_account: item.sale_iva_account?.Id_Plan_Cuentas,
          purchase_iva_account: item.purchase_iva_account?.Id_Plan_Cuentas,
          retefuente_purchase_account: item.retefuente_purchase_account?.Id_Plan_Cuentas,
          reteica_purchase_account: item.reteica_purchase_account?.Id_Plan_Cuentas,
        });
      }
      resolve();
    });

    this.loadingItem = false;
    this.formsValuesChanged = false;
  }

  editEntityTypeInDB() {
    let params = {
      configurable_entity_type: this.configurable_entity_type,
    };
    const requestBody = {
      ...this.getRightForm(),
      ...params,
    };
    delete requestBody.id;
    const request = (resolve: any) => {
      this._contabilidad
        .editEntityTypeItem(
          this.configurable_entity_type === 'product'
            ? this.formProducts.value.id
            : this.form.value.id,
          requestBody,
        )
        .subscribe({
          next: (data: any) => {
            this.closeModal();
            this.getItems();
            resolve(true);
            this._swal.show({
              icon: 'success',
              title: 'Actualización exitosa',
              text: 'La categoria se ha actualizado con exito.',
              showCancel: false,
              timer: 1000,
            });
          },
          error: (error: HttpErrorResponse) => {
            let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
            if (error.error.error) {
              errorMessage = error.error.error;
              this._swal.hardError();
            } else if (error.error.errors) {
              let errorMessages: string[] = [];
              for (const field in error.error.errors) {
                errorMessages.push(error.error.errors[field]);
              }
              const formattedErrorMessage = errorMessages.join('<br/>');
              this._swal.incompleteError(formattedErrorMessage);
            }
          },
        });
    };
    this._swal.swalLoading('Vamos a modificar los valores de la categoría', request);
  }

  private getUrlParams(): void {
    this.accountingService.configurableEntityTypeChanged.subscribe((value: any | undefined) => {
      this.entityTypefromService = value;
      console.log('entityTypefromService Valueee', this.entityTypefromService);
    });
    this.accountingService.handlePagination();
    if (this.entityTypefromService) {
      this.pagination = {
        ...this.pagination,
        page: this.entityTypefromService?.page || this.pagination.page,
        pageSize: this.entityTypefromService?.pageSize || this.pagination.pageSize,
        length: this.entityTypefromService?.length || this.pagination.length,
      };
    }
    this.pagination = this.UrlFiltersService.currentPagination;
    this.filters = {
      ...this.filters,
      ...this.UrlFiltersService.currentFilters,
    };
    switch (this.entityTypefromService?.configurable_entity_type) {
      case 'category':
        this.accountingService.setPaginationCategories(this.pagination);
        console.log('category seteó en onpaginaton');

        break;
      case 'subcategory':
        this.accountingService.setPaginationSubcategories(this.pagination);
        console.log('subcategory seteó en onpaginaton');

        break;
      case 'product':
        this.accountingService.setPaginationProducts(this.pagination);
        console.log('producto default seteó en onpaginaton');
    }

    let params = {
      ...this.pagination,
      ...this.filters,
    };
    this.UrlFiltersService.setUrlFilters(params);

    console.log('this.pagination in getUrlParams', this.pagination);
  }

  translateConfigurableEntityType() {
    switch (this.configurable_entity_type) {
      case 'product':
        return 'producto';
      case 'subcategory':
        return 'subcategoría';
      default:
        return 'categoría';
    }
  }

  onPagination(pageObject: MatPaginator): void {
    console.log('pageObject', pageObject);
    this.pagination.page = Number(pageObject.page) || 1;
    this.pagination.pageSize = pageObject.pageSize || 100;
    switch (this.configurable_entity_type) {
      case 'category':
        this.accountingService.setPaginationCategories(this.pagination);
        console.log('category seteó en onpaginaton');

        break;
      case 'subcategory':
        this.accountingService.setPaginationSubcategories(this.pagination);
        console.log('subcategory seteó en onpaginaton');

        break;
      case 'product':
        this.accountingService.setPaginationProducts(this.pagination);
        console.log('producto default seteó en onpaginaton');
    }
    this.getItems(true);
  }
}

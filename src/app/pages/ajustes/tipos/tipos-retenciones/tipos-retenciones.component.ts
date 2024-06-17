import { Component, OnInit, ViewChild } from '@angular/core';
import { consts } from 'src/app/core/utils/consts';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TiposRetencionesService } from './tipos-retenciones.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbModal, NgbTypeaheadSelectItemEvent, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { InputPositionInitialDirective } from '@app/core/directives/input-position-initial.directive';
import { TitleCasePipe } from '@angular/common';
@Component({
  selector: 'app-tipos-retenciones',
  templateUrl: './tipos-retenciones.component.html',
  styleUrls: ['./tipos-retenciones.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatSelectModule,
    TitleCasePipe,
    FormsModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatInputModule,
    NgbTypeahead,
    TextFieldModule,
    NotDataComponent,
    StatusBadgeComponent,
    InputPositionInitialDirective,
    NgxCurrencyDirective,
  ],
})
export class TiposRetencionesComponent implements OnInit {
  form: UntypedFormGroup;
  masks = consts;
  @ViewChild('modal') modal: any;
  closeResult: string;
  loading: boolean = false;
  accountPlan: any[] = [];
  retentionTypes: any[] = [];
  retention: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtros = {
    nombre: '',
    porcentaje: '',
    cuentaAsociada: '',
    estado: '',
    type: '',
  };
  withholdingTypes: { value: string; text: string }[] = [
    {
      value: 'reteica',
      text: 'Reteica',
    },
    {
      value: 'reteiva',
      text: 'Reteiva',
    },
    {
      value: 'retefuente',
      text: 'Retefuente',
    },
    {
      value: 'otro',
      text: 'Otro',
    },
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private _retentionType: TiposRetencionesService,
    private modalService: NgbModal,
    private _swal: SwalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.createForm();
    this.getRetentionTypes();
    this.getAccountPlan();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters as any;
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.retention.id],
      name: ['', Validators.required],
      percentage: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  private getDismissReason(reason: any) {
    this.form.reset();
  }

  openModal() {
    this.modal.show();
    this.title = 'Nuevo tipo de retención';
  }

  search: OperatorFunction<string, readonly { code }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      //filter((term) => term.length >= 3),
      map((term) =>
        this.accountPlan.filter((state) => new RegExp(term, 'mi').test(state.code)).slice(0, 10),
      ),
    );

  inputFormatBandListValue(value: any) {
    if (value.code) return value.code;
    return value;
  }

  resultFormatBandListValue(value: any) {
    return value.code;
  }

  getAccountPlan() {
    this._retentionType.getAccountPlan().subscribe((r: any) => {
      this.accountPlan = r.data;
    });
  }

  getRetentionTypes() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this._retentionType.getRetentionType(params).subscribe((r: any) => {
      this.retentionTypes = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  getRetention(retention) {
    this.retention = { ...retention };
    this.title = 'Editar tipo de retención';
    this.form.patchValue({
      id: this.retention.id,
      name: this.retention.name,
      percentage: this.retention.percentage,
      description: this.retention.description,
    });
  }

  save() {
    const request = () => {
      this._retentionType.updateOrCreateRetentionType(this.form.value).subscribe((res) => {
        this.modalService.dismissAll();
        this.form.reset();
        this.getRetentionTypes();
        this._swal.show({
          icon: 'success',
          title: 'Proceso satisfactorio',
          text: 'El tipo de retención ha sido creado con éxito.',
          showCancel: false,
          timer: 1500,
        });
      });
    };
    this._swal.swalLoading(`Vamos a crear un nuevo tipo de retención`, request);
  }

  activateOrInactivate(retention, state) {
    let data = { id: retention.id, state };
    const request = () => {
      this._retentionType.updateOrCreateRetentionType(data).subscribe((res) => {
        this.getRetentionTypes();
        this._swal.activateOrInactivateSwalResponse(state, 'El tipo de retención');
      });
    };
    this._swal.swalLoading(
      `${
        state === 'Inactivo'
          ? 'El tipo de retención se inactivará'
          : 'El tipo de retención se activará'
      }`,
      request,
    );
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { camposTerceros } from './campos-terceros';
import { CamposTercerosService } from './campos-terceros.service';
import { SwalService } from '../../services/swal.service';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { ModalService } from 'src/app/core/services/modal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgClass, UpperCasePipe, TitleCasePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';

@Component({
  selector: 'app-campos-terceros',
  templateUrl: './campos-terceros.component.html',
  styleUrls: ['./campos-terceros.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    NotDataComponent,
    UpperCasePipe,
    TitleCasePipe,
    StandardModule,
    AddButtonComponent,
    ActionActivateComponent,
    ActionDeactivateComponent,
    AutomaticSearchComponent,
  ],
})
export class CamposTercerosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  form: UntypedFormGroup;
  tipos = camposTerceros.tipos;
  fields: any[] = [];
  pagination = {
    pageSize: 10,
    page: 1,
    length: 0,
  };
  filtro: any = {
    code: '',
  };

  constructor(
    private fb: UntypedFormBuilder,
    private _field: CamposTercerosService,
    private _swal: SwalService,
    private _modal: ModalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.createForm();
    this.getFields();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtro = this.urlFiltersService.currentFilters;
  }

  openConfirm(content) {
    this._modal.open(content);
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      required: ['', Validators.required],
      length: [''],
    });
  }

  getFields() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._field.getFields(params).subscribe((r: any) => {
      this.loading = false;
      this.fields = r.data.data;
      this.pagination.length = r.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  save() {
    this._field.save(this.form.value).subscribe((r: any) => {
      if (r.err) {
        this._swal.show({
          title: 'ERROR',
          icon: 'error',
          text: r.err,
          showCancel: false,
        });
      } else {
        this._modal.close();
        this.form.reset();
        this.getFields();
        this._swal.show({
          title: r.data,
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false,
        });
      }
    });
  }

  changeState(id, state) {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: state == 'inactivo' ? '¡El campo se anulará!' : '¡El campo se activará!',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._field.changeState({ state: state }, id).subscribe((r: any) => {
            this.getFields();
            this._swal.show({
              icon: 'success',
              title: state === 'inactivo' ? '¡Campo inhabilitado!' : '¡Campo activado!',
              text:
                state == 'inactivo' ? 'El campo ha sido anulado.' : 'El campo ha sido activado.',
              showCancel: false,
              timer: 1000,
            });
          });
        }
      });
  }
}

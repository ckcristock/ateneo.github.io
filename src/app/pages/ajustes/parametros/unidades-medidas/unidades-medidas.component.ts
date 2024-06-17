import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { StandardModule } from '@shared/components/standard-components/standard.module';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { UnidadesMedidasService } from './unidades-medidas.service';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-unidades-medidas',
  standalone: true,
  imports: [
    StandardModule,
    AddButtonComponent,
    ActionEditComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './unidades-medidas.component.html',
  styleUrls: ['./unidades-medidas.component.scss'],
})
export class UnidadesMedidasComponent implements OnInit {
  @ViewChild('modal') modal: any;

  loading: boolean = false;
  form: FormGroup;
  title: string = 'Nueva UM';
  units: any[] = [];
  unit: any = {};
  pagination = {
    page: 1,
    pageSize: 50,
    length: 0,
  };
  filtro: any = {
    name: '',
  };

  constructor(
    private fb: FormBuilder,
    private _units: UnidadesMedidasService,
    private _swal: SwalService,
    private modalService: NgbModal,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.createForm();
    this.getUnits();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtro = this.urlFiltersService.currentFilters;
  }

  openModal() {
    this.modal.show();
    this.title = 'Nueva UM';
  }
  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm', scrollable: true })
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
  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      unit: ['', Validators.required],
    });
  }

  getUnit(unit) {
    this.unit = { ...unit };
    //this.title = 'Actualizar unidad de medida';
    this.form.patchValue({
      id: this.unit.id,
      name: this.unit.name,
      unit: this.unit.unit,
    });
  }

  getUnits(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._units.getUnits(params).subscribe((r: any) => {
      this.units = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  save() {
    const request = () => {
      this._units.save(this.form.value).subscribe((r: any) => {
        this.modalService.dismissAll();
        this.form.reset();
        this.getUnits();
        this._swal.show({
          icon: 'success',
          title: r.data.title,
          text: r.data.text,
          showCancel: false,
          timer: 1000,
        });
      });
    };
    this._swal.swalLoading('', request);
  }
}

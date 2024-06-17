import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalBasicComponent } from 'src/app/components/modal-basic/modal-basic.component';
import { Response } from 'src/app/core/response.model';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { VarHiCostService } from '../../variable-hight-cost/var-hi-cost.service';
import { ManagmentClinicalHistoryService } from '../managment-clinical-history.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalBasicComponent as ModalBasicComponent_1 } from '../../../../components/modal-basic/modal-basic.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'undefined-variables-clinical-model',
  templateUrl: './variables-clinical-model.component.html',
  styleUrls: ['./variables-clinical-model.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgbTooltip,
    ModalBasicComponent_1,
    NgSelectModule,
  ],
})
export class VariablesClinicalModelComponent implements OnInit {
  @ViewChild(ModalBasicComponent) modal: ModalBasicComponent;
  loading: boolean = false;
  form: UntypedFormGroup;
  title: any = '';
  models: any[] = [];
  module: any = {};
  varHiCostList: any = [];
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0,
  };
  filtro = {
    name: '',
  };
  formVarHiCost: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private _validators: ValidatorsService,
    private _clinicalHistoryModels: ManagmentClinicalHistoryService,
    private _swal: SwalService,
    private router: Router,
    private route: ActivatedRoute,
    private _varHiCostService: VarHiCostService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getVarHiCost();
    this.get();
  }

  getVarHiCost() {
    this._varHiCostService.get().subscribe((res: Response) => (this.varHiCostList = res.data));
  }

  openModal() {
    this.modal.show();
    this.title = 'Nuevo Modelo ';
  }

  closeModalVer() {
    this.modal.hide();
    this.fieldList.clear();
    // this.dependencexList.clear();
  }
  closeModal() {
    this.modal.hide();
    this.fieldList.clear();
    // this.dependencexList.clear();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.route.snapshot.params['id']],
      fields: this.fb.array([]),
    });
    this.formVarHiCost = this.fb.group({
      variableHightCostList: this.fb.array([]),
    });
  }

  get fieldList() {
    return this.form.get('fields') as UntypedFormArray;
  }

  get xxx() {
    return this.formVarHiCost.get('variableHightCostList') as UntypedFormArray;
  }

  newField() {
    let field = this.fieldList;
    field.push(this.fieldsControl());
  }

  newVariableHightCost() {
    let field = this.xxx;
    field.push(this.VariableHightCostControl());
  }

  newDependence(i: UntypedFormGroup) {
    let dependence = i.get('dependencex') as UntypedFormArray;
    dependence.push(this.dependenceControl());
  }

  dependenceControl(): UntypedFormGroup {
    let field = this.fb.group({
      dependencia: ['', this._validators.required],
      valueDependend: [''],
      parent: ['', this._validators.required],
      valueConditions: ['', this._validators.required],
    });
    return field;
  }

  fieldsControl() {
    let field = this.fb.group({
      property: [''],
      dependencex: this.fb.array([]),
      valueDependend: [''],
      required: [''],
      parent: [''],
      type: [''],
      value: [''],
    });
    return field;
  }

  VariableHightCostControl() {
    let field = this.fb.group({
      property: [''],
    });
    return field;
  }

  deleteField(i) {
    this.fieldList.removeAt(i);
  }

  deleteVariableHightCost(i) {
    this.xxx.removeAt(i);
  }

  deleteDependence(i) {
    this.fieldList.removeAt(i);
    i.get('dependencex').removeAt(i);
  }

  get(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._clinicalHistoryModels.get(params).subscribe((r: any) => {
      this.models = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    });
  }

  save() {
    this._clinicalHistoryModels.sendVariables(this.form.value).subscribe((res: Response) => {
      this._swal.show({
        icon: 'success',
        title: 'Modelo  actualizado con éxito',
        text: '',
        showCancel: false,
      });

      this.router.navigate([
        '/gestion-riesgo/administracion-historia-clinica/edit',
        this.route.snapshot.params['id'],
      ]);
    });
  }
}

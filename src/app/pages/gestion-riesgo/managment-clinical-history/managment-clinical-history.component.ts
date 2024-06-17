import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ModalBasicComponent } from 'src/app/components/modal-basic/modal-basic.component';
import { BuilderFormComponent } from 'src/app/core/builder-form/builder-form.component';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { ManagmentClinicalHistoryService } from './managment-clinical-history.service';
import { BuilderFormComponent as BuilderFormComponent_1 } from '../../../core/builder-form/builder-form.component';
import { ModalBasicComponent as ModalBasicComponent_1 } from '../../../components/modal-basic/modal-basic.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, UpperCasePipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'undefined-managment-clinical-history',
  templateUrl: './managment-clinical-history.component.html',
  styleUrls: ['./managment-clinical-history.component.css'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf,
    NgFor,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    NotDataComponent,
    ModalBasicComponent_1,
    BuilderFormComponent_1,
    UpperCasePipe,
    DatePipe,
  ],
})
export class ManagmentClinicalHistoryComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(ModalBasicComponent) modalForm: ModalBasicComponent;
  @ViewChild(BuilderFormComponent) builderForm: BuilderFormComponent;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }
  loading: boolean = false;

  title: any = '';

  models: any[] = [];

  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0,
  };
  filtro = {
    name: '',
  };

  config: object = {
    ruta_save_form: '/model-clinical-history',
    ruta_update_form: '/model-clinical-history',
    ruta_get_fields: '/get-fields-for-form',
    service: 'ClinicalHistoryService',
    IdForm: 1,
    size: 12,
  };
  constructor(
    private _clinicalHistoryModels: ManagmentClinicalHistoryService,
    private _swal: SwalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.get();
  }

  openModal() {
    this.modalForm.show();
  }
  closeModal() {
    this.modalForm.hide();
  }

  editClinicalModel(model) {
    this.router.navigate(['/gestion-riesgo/administracion-historia-clinica/edit', model.id]);
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

  update = (data) => {
    this.get();
    this.modalForm.hide();
    this._swal.show({
      icon: 'success',
      title: `Modelo  ${data.status} con éxito`,
      text: '',
      showCancel: false,
    });
  };
}

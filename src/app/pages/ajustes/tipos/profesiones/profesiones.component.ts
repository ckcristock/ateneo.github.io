import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProfesionesService } from './profesiones.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { timer } from 'rxjs';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ModalBasicComponent } from '../../../../components/modal-basic/modal-basic.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profesiones',
  templateUrl: './profesiones.component.html',
  styleUrls: ['./profesiones.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    NotDataComponent,
    ModalBasicComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProfesionesComponent implements OnInit {
  @ViewChild('modal') modal: any;
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
  form: UntypedFormGroup;
  professions: any[] = [];
  profession: any;
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0,
  };
  constructor(
    private fb: UntypedFormBuilder,
    private _professions: ProfesionesService,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getProfessions();
  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      /* id:[] */
      name: ['', Validators.required],
    });
  }

  getProfessions(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._professions.getProfessions(this.pagination).subscribe((res: any) => {
      this.loading = false;
      this.professions = res.data.data;
      this.pagination.collectionSize = res.total;
    });
  }

  createProfession() {
    this._professions.createNewProfession(this.form.value).subscribe((r: any) => {
      this.modal.hide();
      this.form.reset();
      this.getProfessions();
      this._swal.show({
        title: 'Creado con éxito',
        text: '¡La Profesión ha sido creada!',
        icon: 'success',
        timer: 2500,
        showCancel: false,
      });
    });
  }

  activateOrInactivate(profession, state) {
    let data = {
      id: profession.id,
      state,
    };
    this._swal
      .show({
        title: '¿Estas Seguro?',
        text: '¡La Profesión será Desactivada!',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._professions.createNewProfession(data).subscribe((r: any) => {
            this.getProfessions();
          });
          this._swal.show({
            icon: 'success',
            title: '¡Proceso Satisfactorio!',
            text: 'La Profesión ha sido Activada con éxito.',
            timer: 2500,
            showCancel: false,
          });
        }
      });
  }
}

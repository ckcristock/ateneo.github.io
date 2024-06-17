import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertOptions } from 'sweetalert2';
import { BodegasService } from '../bodegas.service.';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SwalService } from '../../services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgClass } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';

@Component({
  selector: 'app-grupoestiba',
  templateUrl: './grupoestiba.component.html',
  styleUrls: ['./grupoestiba.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    NgClass,
    ReactiveFormsModule,
    NotDataComponent,
    StandardModule,
    AddButtonComponent,
    HeaderButtonComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    StatusBadgeComponent,
  ],
})
export class GrupoestibaComponent implements OnInit {
  formGrupo!: UntypedFormGroup;
  formEstiba!: UntypedFormGroup;
  dataFormGrupo: any;
  dataFormEstiba: any;
  closeResult = '';

  public alertOptionMapa: SweetAlertOptions = {};
  public bodega: any = {};
  public id!: string | null;
  public grupos: any = [];
  public startTime: any;
  public estibas: any = [];
  public abriendo = 0;
  public loadingEstibas = false;
  public loadingGrupos = false;
  public currentPageEstibas = 1;
  public sizeEstibas = 0;
  public currentPageGrupos = 1;
  public filtrosEstibas = {
    Nombre: '',
    Codigo_Barras: '',
    Estado: '',
  };
  public filtrosGrupos = {
    Nombre: '',
    Fecha_Vencimiento: '',
    Presentacion: '',
  };
  public pagination: any = {
    grupos: {
      page: 1,
      pageSize: 5,
      length: 0,
    },
    estibas: {
      page: 1,
      pageSize: 5,
      length: 0,
    },
  };
  public grupoSelected: any = {
    id: null,
    nombre: '',
  };
  public tituloFormulario: any = '';

  constructor(
    private route: ActivatedRoute,
    private _bodegas: BodegasService,
    private _swal: SwalService,
    private _modal: ModalService,
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getBodega();
    this.getGrupos();
    this.createFormGrupo();
  }

  createFormGrupo() {
    this.formGrupo = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      idBodega: [this.id, Validators.required],
      fechaVencimiento: ['', Validators.required],
      presentacion: ['', Validators.required],
    });
  }

  createFormEstiba() {
    this.formEstiba = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      idBodega: [this.id, Validators.required],
      idGrupo: [this.grupoSelected.id, Validators.required],
      codigoBarras: ['', Validators.required],
      estado: ['Disponible', Validators.required],
    });
  }
  public openConfirm(confirm: any, titulo: any, modulo = '') {
    this.tituloFormulario = titulo;
    this._modal.open(confirm);
    if (modulo == 'grupo') {
      this.formGrupo.reset();
      this.formGrupo.get('idBodega')?.setValue(this.id);
    } else if (modulo == 'estiba') {
      this.formEstiba.reset();
      this.formEstiba.get('idBodega')?.setValue(this.id);
      this.formEstiba.get('idGrupo')?.setValue(this.grupoSelected.id);
    }
  }

  selected(model: any, value: any) {
    model = model.map((m: any) => {
      m.selected = m.Id_Grupo_Estiba == value ? true : false;
    });
  }
  getBodega() {
    this._bodegas.getBodega(this.id).subscribe((res: any) => {
      this.bodega = res.data;
      this.alertOptionMapa = {
        title: 'Mapa de la bodega ' + this.bodega.Nombre,
        text: 'Ubicación de las Estibas',
        imageUrl: res.data.Mapa,
        imageWidth: 700,
        width: 800,
      };
    });
  }

  getGrupo(data: any) {
    this.dataFormGrupo = { ...data };
    this.formGrupo.patchValue({
      id: this.dataFormGrupo.Id_Grupo_Estiba,
      nombre: this.dataFormGrupo.Nombre,
      idBodega: this.id,
      fechaVencimiento: this.dataFormGrupo.Fecha_Vencimiento,
      presentacion: this.dataFormGrupo.Presentacion,
    });
  }

  getEstiba(data: any) {
    this.dataFormEstiba = { ...data };
    this.formEstiba.patchValue({
      id: this.dataFormEstiba.Id_Estiba,
      nombre: this.dataFormEstiba.Nombre,
      idBodega: this.id,
      idGrupo: this.dataFormEstiba.Id_Grupo_Estiba,
      codigoBarras: this.dataFormEstiba.Codigo_Barras,
      estado: this.dataFormEstiba.Estado,
    });
  }

  getGrupos() {
    let params = {
      ...this.pagination.grupos,
      ...this.filtrosGrupos,
    };
    this.loadingGrupos = true;
    this._bodegas.getGruposBodega(this.id, params).subscribe((res: any) => {
      this.grupos = res.data.data;
      this.loadingGrupos = false;
      this.pagination.grupos.length = res.data.total;
    });
  }

  getEstibas(grupo: any) {
    let params = {
      ...this.pagination.estibas,
      ...this.filtrosEstibas,
    };
    this.loadingEstibas = true;
    this._bodegas.getEstibasGrupo(grupo, params).subscribe((res: any) => {
      this.estibas = res.data.data;
      this.loadingEstibas = false;
      this.pagination.estibas.length = res.data.total;
    });
  }

  async createGrupo() {
    try {
      await this._swal.confirm(`${this.tituloFormulario} grupo de estibas`, {
        preConfirm: () => {
          return new Promise((resolve) => {
            this._bodegas.createGrupo(this.formGrupo.value).subscribe({
              next: (res: any) => {
                this.getGrupos();
                this._modal.close();
                this._swal.show({
                  icon: 'success',
                  title: res.data,
                  text: 'Se ha agregado el grupo con éxito.',
                  timer: 1000,
                  showCancel: false,
                });
                resolve(true);
              },
              error: () => {
                this._swal.show({
                  title: 'ERROR',
                  text: 'Aún no puedes editar una bodega con el mismo código, estamos trabajando en esto.',
                  icon: 'error',
                  showCancel: false,
                });
                resolve(false);
              },
            });
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this._swal.hardError();
    }
  }

  async createEstiba() {
    try {
      await this._swal.confirm(`${this.tituloFormulario} estiba`, {
        preConfirm: () => {
          return new Promise((resolve) => {
            this._bodegas.createEstiba(this.formEstiba.value).subscribe({
              next: (res: any) => {
                this.getEstibas(this.grupoSelected.id);
                this._modal.close();
                this._swal.show({
                  icon: 'success',
                  title: res.data,
                  text: 'Se ha agregado la estiba con éxito.',
                  timer: 1000,
                  showCancel: false,
                });
                resolve(true);
              },
              error: () => {
                this._swal.show({
                  title: 'ERROR',
                  text: 'Aún no puedes editar una bodega con el mismo código, estamos trabajando en esto.',
                  icon: 'error',
                  showCancel: false,
                });
                resolve(false);
              },
            });
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this._swal.hardError();
    }
  }

  async cambiarEstado(grupo: any, state: any) {
    let data = {
      id: grupo.Id_Grupo_Estiba,
      modulo: 'grupo',
      state,
    };
    try {
      await this._swal.confirm(
        grupo.Estado == 'activo'
          ? '¡El grupo de estibas será desactivado!'
          : '¡El grupo de estibas será activado!',
        {
          preConfirm: () => {
            return new Promise((resolve) => {
              this._bodegas.activarInactivar(data).subscribe({
                next: () => {
                  this.getGrupos();
                  this._swal.show({
                    icon: 'success',
                    title: 'Tarea completada con éxito!',
                    text:
                      grupo.Estado == 'Inactivo'
                        ? 'El grupo de estibas ha sido activado con éxito.'
                        : 'El grupo de estibas ha sido desactivado con éxito.',
                    timer: 1000,
                    showCancel: false,
                  });
                  resolve(true);
                },
                error: () => {
                  resolve(false);
                },
              });
            });
          },
          showLoaderOnConfirm: true,
        },
      );
    } catch (error) {
      this._swal.hardError();
    }
  }
}

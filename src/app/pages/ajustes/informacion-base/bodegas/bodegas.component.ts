import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { ModalService } from 'src/app/core/services/modal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { SwalService } from '../services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { BodegasService } from './bodegas.service.';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionButtonComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatInputModule,
    NotDataComponent,
    StatusBadgeComponent,
  ],
})
export class BodegasComponent implements OnInit {
  formBodega!: UntypedFormGroup;
  selected: any = '';
  private bodega: any = {};
  public loading: boolean = false;
  public filtros: any = {
    Nombre: '',
    Direccion: '',
    Telefono: '',
    Compra_Internacional: '',
  };
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  bodegas: any[] = [];
  filename: any = '';
  fileString: any = '';
  type: any = '';
  file: any = '';

  activeFilters = false;

  constructor(
    private bodegaService: BodegasService,
    private _swal: SwalService,
    private _modal: ModalService,
    private fb: UntypedFormBuilder,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.getBodegas();
    this.createForm();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
  }
  createForm() {
    this.formBodega = this.fb.group({
      id: [this.bodega.Id_Bodega_Nuevo],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      compraInternacional: ['', Validators.required],
      mapa: [''],
      typeMapa: [''],
    });
  }

  openConfirm(confirm: any, titulo: any) {
    this.selected = titulo;
    this._modal.open(confirm, 'md');
    this.formBodega.reset();
    this.file = '';
    this.type = '';
    this.bodega = this.formBodega.value;
  }

  onFileChanged(event: any) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
        return null;
      }
      this.filename = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
        this.formBodega.patchValue({
          mapa: this.file,
          typeMapa: this.type,
        });
      });
    }
  }

  getBodega(data: any) {
    this.bodega = { ...data };
    this.formBodega.patchValue({
      id: this.bodega.Id_Bodega_Nuevo,
      nombre: this.bodega.Nombre,
      direccion: this.bodega.Direccion,
      telefono: this.bodega.Telefono,
      compraInternacional: this.bodega.Compra_Internacional,
      mapa: this.bodega.Mapa,
    });
  }

  async createBodega() {
    try {
      await this._swal.confirm(
        `Se ${this.bodega.Id_Bodega_Nuevo ? 'editará la' : 'agregará una nueva'} bodega`,
        {
          preConfirm: () => {
            return new Promise((resolve) => {
              this.bodegaService.createBodega(this.formBodega.value).subscribe({
                next: (res: any) => {
                  this.getBodegas();
                  this._modal.close();
                  this._swal.show({
                    icon: 'success',
                    title: res.data,
                    text: `Se ha ${
                      this.bodega.Id_Bodega_Nuevo ? 'editado' : 'agregado'
                    } la bodega con éxito.`,
                    timer: 1000,
                    showCancel: false,
                  });
                  resolve(true);
                },
                error: (err) => {
                  this._swal.show({
                    title: 'ERROR',
                    text: err.error.text,
                    icon: 'error',
                    showCancel: false,
                  });
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

  getBodegas() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this.bodegaService.getBodegas(params).subscribe((res: any) => {
      this.bodegas = res.data.data;
      this.loading = false;
      this.pagination.length = res.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  cambiarEstado(bodega: any, state: any) {
    let data = { id: bodega.Id_Bodega_Nuevo, modulo: 'bodega', state };
    const text = 'La bodega';
    const request = () => {
      this.bodegaService.activarInactivar(data).subscribe((res) => {
        this.getBodegas();
        this._swal.activateOrInactivateSwalResponse(state, text);
      });
    };
    this._swal.activateOrInactivateSwal(state, text, request);
  }
}

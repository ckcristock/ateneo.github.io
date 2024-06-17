import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HotelesService } from '../hoteles/hoteles.service';
import { TaxisService } from './taxis.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { consts } from 'src/app/core/utils/consts';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { UpperCasePipe, DecimalPipe } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionEditComponent } from '../../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  styleUrls: ['./taxis.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatInputModule,
    NgSelectModule,
    NotDataComponent,
    UpperCasePipe,
    DecimalPipe,
    CapitalLetterPipe,
  ],
})
export class TaxisComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  form: UntypedFormGroup;
  cities: any[] = [];
  taxis: any[] = [];
  taxi: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtro = {
    tipo: '',
  };

  masksMoney = consts;
  constructor(
    private fb: UntypedFormBuilder,
    private _cities: HotelesService,
    private _taxi: TaxisService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCities();
    this.getTaxis();
  }

  openModal() {
    this.modal.show();
  }

  closeResult = '';
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

  createForm() {
    this.form = this.fb.group({
      id: [this.taxi.id],
      route: ['', Validators.required],
      type: ['', Validators.required],
      city_id: [null, Validators.required],
      value: ['', Validators.required],
      taxi_id: [Validators.required],
    });
  }

  getCities() {
    this._cities.getCities().subscribe((r: any) => {
      this.cities = r.data;
    });
  }

  getTaxis() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._taxi.getTaxis(params).subscribe((r: any) => {
      this.taxis = r.data.data;
      this.loading = false;
      this.pagination.length = r.data.total;
    });
  }

  async getTaxi(taxi) {
    this.taxi = { ...taxi };
    this.form.patchValue({
      id: this.taxi?.id,
      route: this.taxi?.taxi?.route,
      city_id: this.taxi?.city_id,
      type: this.taxi.type,
      value: this.taxi?.value,
      taxi_id: this.taxi?.taxi_id,
    });
  }

  save() {
    let id = this.form.value.id;
    if (id) {
      this._taxi.updateTaxi(this.form.value, id).subscribe(
        (r: any) => {
          this.modalService.dismissAll();
          this.getTaxis();
          this.form.reset();
          this._swal.show({
            icon: 'success',
            title: '¡Acualizado!',
            text: 'El taxi ha sido actualizado satisfactoriamente.',
            showCancel: false,
            timer: 1000,
          });
        },
        (err) => {
          this._swal.show({
            title: 'ERROR',
            text: 'Intenta más tarde',
            icon: 'error',
            showCancel: false,
          });
        },
      );
    } else {
      this._taxi.createTaxi(this.form.value).subscribe(
        (r: any) => {
          this.modalService.dismissAll();
          this.getTaxis();
          this.form.reset();
          this._swal.show({
            icon: 'success',
            title: '¡Creado!',
            text: 'El taxi ha sido creado satisfactoriamente',
            showCancel: false,
            timer: 1000,
          });
        },
        (err) => {
          this._swal.show({
            title: 'ERROR',
            text: 'Intenta más tarde',
            icon: 'error',
            showCancel: false,
          });
        },
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HotelesService } from './hoteles.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/services/modal.service';
import { AccommodationsComponent } from './accommodations/accommodations.component';
import { consts } from 'src/app/core/utils/consts';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { InputPositionDirective } from '../../../../../core/directives/input-position.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionButtonComponent } from '../../../../../shared/components/standard-components/action-button/action-button.component';
import { ActionEditComponent } from '../../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { UpperCasePipe } from '@angular/common';
import { TableComponent } from '../../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { HeaderButtonComponent } from '../../../../../shared/components/standard-components/header-button/header-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-hoteles',
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    HeaderButtonComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionButtonComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatInputModule,
    NgSelectModule,
    InputPositionDirective,
    AccommodationsComponent,
    NotDataComponent,
    UpperCasePipe,
    CapitalLetterPipe,
  ],
})
export class HotelesComponent implements OnInit {
  loading: boolean = false;
  loadingTypes: boolean = false;
  form: UntypedFormGroup;
  cities: any[] = [];
  hotels: any[] = [];
  hotel: any = {};
  title: any = '';
  paginationHotel = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  paginationAccomodations = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtro = {
    tipo: '',
  };
  accommodationsPaginate: any = {};
  accommodations: any[] = [];
  masksMoney = consts;

  constructor(
    private fb: UntypedFormBuilder,
    private _hoteles: HotelesService,
    private _swal: SwalService,
    private modalService: NgbModal,
    private _modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCities();
    this.getHotels();
    this.getAccommodation();
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    if (titulo == 'Ver hotel') {
      this._modal.open(confirm, 'md', true);
    } else {
      this.modalService
        .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true })
        .result.then(
          (result) => {},
          (reason) => {
            this.getDismissReason();
          },
        );
    }
  }

  private getDismissReason() {
    this.form.reset();
    this.form.removeControl('alojamientos');
    this.form.setControl('alojamientos', this.fb.array([]));
  }

  getAccommodation() {
    this.loadingTypes = true;
    let params = {
      ...this.paginationAccomodations,
      ...this.filtro,
    };
    this._hoteles.getAccommodationPaginate(params).subscribe((res: any) => {
      if (res.status) {
        this.accommodationsPaginate = res.data.data;
        this.loadingTypes = false;
        this.paginationAccomodations.length = res.data.total;
      } else {
        this._swal.error();
      }
    });
    this._hoteles.getAccommodation().subscribe((res: any) => {
      if (res.status) {
        this.accommodations = res.data;
      } else {
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.hotel.id],
      type: ['', Validators.required],
      name: ['', Validators.required],
      city_id: [null, Validators.required],
      landline: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      breakfast: ['', Validators.required],
      accommodation: ['', Validators.required],
      alojamientos: this.fb.array([]),
    });
  }

  /**
   * se recibe solo el evento, porque el objeto como tal no señala si fue checked o no
   */
  selectAccommodation(e) {
    if (e._selected) {
      let subItems = this.form.get('alojamientos') as UntypedFormArray;
      let elem = this.accommodations.find((ele) => ele.id == e.value);
      subItems.push(this.patchValues(elem.id, elem.name, null));
    } else {
      this.form.controls.alojamientos.value.forEach((element, index) => {
        if (element.id == e.value) {
          let a = this.form.get('alojamientos') as UntypedFormArray;
          a.removeAt(index);
        }
      });
    }
  }

  patchValues(id, name, price) {
    return this.fb.group({
      id: [id],
      name: name,
      price: [price ? price : ''],
    });
  }

  getCities() {
    this._hoteles.getCities().subscribe((r: any) => {
      this.cities = r.data;
    });
  }

  getHotels() {
    let params = {
      ...this.paginationHotel,
      ...this.filtro,
    };
    this.loading = true;
    this._hoteles.getHotels(params).subscribe((r: any) => {
      this.hotels = r.data.data;
      this.paginationHotel.length = r.data.total;
      this.loading = false;
    });
  }

  getHotel(hotel) {
    this.hotel = { ...hotel };

    this.form.patchValue({
      id: this.hotel?.id,
      type: this.hotel?.type,
      name: this.hotel?.name,
      city_id: this.hotel?.city_id,
      landline: this.hotel?.landline,
      address: this.hotel?.address,
      phone: this.hotel?.phone,
      simple_rate: this.hotel?.simple_rate,
      double_rate: this.hotel?.double_rate,
      breakfast: this.hotel?.breakfast,
      accommodation: this.hotel.accommodations.map((x: any) => x.id),
    });

    this.hotel.accommodations.forEach((element) => {
      let subItems = this.form.get('alojamientos') as UntypedFormArray;
      subItems.push(this.patchValues(element.id, element.name, element.pivot.price));
    });
  }

  save() {
    this._hoteles.createHotel(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.getHotels();
      this.form.reset();
      this._swal.show({
        icon: 'success',
        title: r.data,
        text: '',
        timer: 1000,
        showCancel: false,
      });
    });
  }

  //el event está enviando el this.form del hijo
  saveAccommodation($event) {
    this._hoteles.createUpdateAccomodation($event.value).subscribe((res: any) => {
      if (res.status) {
        this._swal.show({
          title: 'Alojamiento',
          text: res.data,
          icon: 'success',
          showCancel: false,
        });
        this.getAccommodation();
        $event.reset();
      } else {
        this._swal.show({
          title: 'Alojamiento',
          text: res.err,
          icon: 'error',
          showCancel: false,
        });
      }
    });
  }

  deleteAccommodation($event) {
    if ($event.action == 'Inactivo') {
      this._hoteles.deleteAccommodation($event.value.id).subscribe((res: any) => {
        if (res.status) {
          this._swal.show({
            title: 'Alojamiento',
            text: res.data,
            icon: 'success',
            showCancel: false,
          });
          this.getAccommodation();
        } else {
          this._swal.show({
            title: 'Alojamiento',
            text: res.err,
            icon: 'error',
            showCancel: false,
          });
        }
      });
    } else {
      this._hoteles.restoreAccommodation($event.value).subscribe((res: any) => {
        if (res.status) {
          this._swal.show({
            title: 'Alojamiento',
            text: res.data,
            icon: 'success',
            showCancel: false,
          });
          this.getAccommodation();
        } else {
          this._swal.show({
            title: 'Alojamiento',
            text: res.err,
            icon: 'error',
            showCancel: false,
          });
        }
      });
    }
  }

  openValues(content) {
    this._modal.open(content, 'md');
  }
}

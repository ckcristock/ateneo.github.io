import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataDinamicService } from 'src/app/services/data-dinamic.service';
import { SwalService } from '../../services/swal.service';
import { Cup } from '../cup.model';
import { CupService } from '../cup.service';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShowErrorsComponent } from '../../../../../components/show-errors/show-errors.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-cup',
  templateUrl: './modal-cup.component.html',
  styleUrls: ['./modal-cup.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ShowErrorsComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class ModalCupComponent implements OnInit {
  @ViewChild('add') add: any;
  @Output()
  dataChange: EventEmitter<string> = new EventEmitter<string>();

  specialities: Array<object> = [];
  cups_type: Array<object> = [];
  colors: Array<object> = [];

  cup: Cup;

  filtros: any = {
    description: '',
    code: '',
  };
  form: UntypedFormGroup;
  status: any = 'Inactivo';
  loading: boolean = false;

  constructor(
    private _cupService: CupService,
    private _dataDinamic: DataDinamicService,
    private modalService: NgbModal,
    private _swal: SwalService,
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.cup = new Cup();
    this.getSpecialties();
    this.getTypes();
    this.getColors();
    this.createForm();
  }
  tube_view: boolean = false;
  createForm() {
    this.form = this.fb.group({
      id: [],
      description: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      specialities: ['', Validators.required],
      type_service_id: [''],
      color_id: [''],
    });
    this.form.controls.type_service_id.valueChanges.subscribe((r) => {
      r.forEach((element) => {
        element == 8 ? (this.tube_view = true) : (this.tube_view = false);
      });
    });
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true })
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
    this.cup.id = null;
  }

  openModal = async () => {
    if (!this.cup.id) {
      this.openConfirm(this.add);
    } else {
      await this._cupService
        .getCup(this.cup.id)
        .toPromise()
        .then((req: any) => {
          this.openConfirm(this.add);
          this.cup = Object.assign({}, req.data);
          this.cup.specialities = this.transformData(req.data.specialities);
          this.cup.type_service = this.transformData(req.data.type_service);
          this.form.patchValue({
            id: this.cup.id,
            description: req.data.description,
            code: req.data.code,
            specialities: this.cup.specialities,
            type_service_id: this.cup.type_service,
            color_id: req.data.color_id,
          });
          this.form.controls.type_service_id.value.forEach((element) => {
            element == 8 ? (this.tube_view = true) : (this.tube_view = false);
          });
        });
    }
  };

  transformData = (array: Array<object>): any => array.map(({ ...obj }) => obj['id']);

  createNewCups() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return false;
    }
    this._cupService.createNewCup(this.form.value).subscribe((res: any) => {
      if (res.code === 200) {
        this.dataChange.emit('');
        this.modalService.dismissAll();
        this._swal.show({
          icon: 'success',
          title: res.data,
          showCancel: false,
          text: '',
          timer: 1000,
        });
      } else {
        this._swal.show({
          icon: 'error',
          title: 'Operación denegada',
          showCancel: false,
          text: res.err,
        });
      }
    });
  }

  getSpecialties = () => {
    this._dataDinamic.getSpecialties('', '').subscribe((resp: any) => {
      this.specialities = resp.data;
    });
  };

  getTypes() {
    this._cupService.getTypes().subscribe((resp: any) => {
      this.cups_type = resp.data;
    });
  }

  getColors() {
    this._cupService.getColors().subscribe((resp: any) => {
      this.colors = resp.data;
    });
  }
}

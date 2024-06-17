import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from '../../../../services/swal.service';
import { AfiliacionesService } from './afiliaciones.service';
import { UserDetail } from '../../interfaces/detalle.interface';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgClass, UpperCasePipe } from '@angular/common';
import { AutocompleteFcComponent } from '@app/components/autocomplete-fc/autocomplete-fc.component';

@Component({
  selector: 'app-afiliaciones',
  templateUrl: './afiliaciones.component.html',
  styleUrls: ['./afiliaciones.component.scss'],
  standalone: true,
  imports: [
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    UpperCasePipe,
    AutocompleteFcComponent,
  ],
})
export class AfiliacionesComponent implements OnInit {
  @Input() userDetail: Partial<UserDetail> = {};
  @Output() updateSuccess: EventEmitter<void> = new EventEmitter();

  @ViewChild('add') add: any;
  form: UntypedFormGroup;
  eps: any;
  loading: boolean;
  compensations: any;
  pensions: any;
  severances: any;
  arls: any;
  loadingInfo: boolean = false;
  afiliations: any;
  constructor(
    private fb: UntypedFormBuilder,
    private afiliationService: AfiliacionesService,
    private activateRoute: ActivatedRoute,
    private _swal: SwalService,
    private _modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.setFormUser();
    // this.getAfiliationInfo();
  }

  private setFormUser(): void {
    this.form.patchValue({
      eps_id: this.userDetail?.eps?.id,
      pension_fund_id: this.userDetail?.pension_funds?.id,
      severance_fund_id: this.userDetail?.severance_fund?.id,
      compensation_fund_id: this.userDetail?.compensation_fund?.id,
      arl_id: this.userDetail?.arl?.id,
    });
  }

  async openModal() {
    this._modal.open(this.add, 'lg');
    this.loadingInfo = true;
    this.getEpss();
    this.getCompensations_funds();
    this.getPension_funds();
    this.getSeverance_funds();
    await this.getArls();
    this.loadingInfo = false;
  }

  createForm() {
    this.form = this.fb.group({
      eps_id: ['', Validators.required],
      pension_fund_id: ['', Validators.required],
      severance_fund_id: ['', Validators.required],
      compensation_fund_id: ['', Validators.required],
      arl_id: ['', Validators.required],
    });
  }

  updateAfiliation() {
    const request = () => {
      this.afiliationService.updateAfiliation(this.form.value, this.id).subscribe((res) => {
        this.updateSuccess.emit();
        this._modal.close();
        this._swal.show({
          title: 'Actualizado correctamente',
          text: '',
          icon: 'success',
          showCancel: false,
          timer: 1000,
        });
      });
    };
    this._swal.swalLoading('', request);
  }

  getEpss() {
    this.afiliationService.getEpss().subscribe((res: any) => {
      this.eps = res.data;
    });
  }

  getCompensations_funds() {
    this.afiliationService.getCompensationFund().subscribe((res: any) => {
      this.compensations = res.data;
    });
  }

  getPension_funds() {
    this.afiliationService.getPension_funds().subscribe((res: any) => {
      this.pensions = res.data;
    });
  }

  getSeverance_funds() {
    this.afiliationService.getSeverance_funds().subscribe((res: any) => {
      this.severances = res.data;
    });
  }

  async getArls() {
    await this.afiliationService
      .getArls()
      .toPromise()
      .then((res: any) => {
        this.arls = res.data;
      });
  }

  get eps_valid() {
    return this.form.get('eps_id').invalid && this.form.get('eps_id').touched;
  }

  get arl_valid() {
    return this.form.get('arl_id').invalid && this.form.get('arl_id').touched;
  }

  get pension_found_valid() {
    return this.form.get('pension_fund_id').invalid && this.form.get('pension_fund_id').touched;
  }

  get severance_found_valid() {
    return this.form.get('severance_fund_id').invalid && this.form.get('severance_fund_id').touched;
  }

  get compensation_valid() {
    return (
      this.form.get('compensation_fund_id').invalid && this.form.get('compensation_fund_id').touched
    );
  }

  get id(): void {
    return this.activateRoute.snapshot.params.id;
  }
}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PersonDataService } from '../personData.service';
import { SeveranceFundsService } from '../../../services/severanceFounds.service';
import { PensionFundsService } from '../../../services/pensionFunds.service';
import { CompensationFundsService } from '../../../services/compensationFunds.service';
import { EpssService } from '../../../services/epss.service';
import { ArlService } from '../../../../parametros/nomina/components/arl/arl.service';
import { ReloadButtonComponent } from '../../../../../../components/reload-button/reload-button.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgClass } from '@angular/common';
import { AutocompleteFcComponent } from '@app/components/autocomplete-fc/autocomplete-fc.component';
import { SwalService } from '../../../services/swal.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-prestaciones-sociales',
  templateUrl: './prestaciones-sociales.component.html',
  styleUrls: ['./prestaciones-sociales.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgSelectModule,
    ReloadButtonComponent,
    AutocompleteFcComponent,
    MatButtonModule,
  ],
})
export class PrestacionesSocialesComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();
  @Output('anterior') anterior = new EventEmitter();

  compensationFunds: any[];
  severanceFunds: any[];
  pensionFunds: any[];
  arl: any[];
  epss: any[];

  person: any;
  $person: Subscription;
  formPrestation: UntypedFormGroup;
  reload: boolean;

  constructor(
    private _person: PersonDataService,
    private fb: UntypedFormBuilder,
    private _severanceFund: SeveranceFundsService,
    private _pensionFund: PensionFundsService,
    private _compensationFund: CompensationFundsService,
    private _epss: EpssService,
    private _arl: ArlService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.crearForm();
    this.reloadData();
  }

  async reloadData() {
    this.reload = true;
    this.$person = this._person.person.subscribe((r) => {
      this.person = r;
    });
    this.getEpss();
    this.getPensionFounds();
    this.getSeveranceFounds();
    this.getCompensationFounds();
    await this.getArl();
    this.reload = false;
  }

  getCompensationFounds() {
    this._compensationFund.getCompensationFunds().subscribe((r: any) => {
      this.compensationFunds = r.data;
      this.compensationFunds.unshift({ text: 'Selecciona', value: '' });
    });
  }

  async getArl() {
    await this._arl
      .getArl()
      .toPromise()
      .then((r: any) => {
        this.arl = r.data;
        this.arl.unshift({ text: 'Selecciona', value: '' });
      });
  }
  getPensionFounds() {
    this._pensionFund.getPensionFounds().subscribe((r: any) => {
      this.pensionFunds = r.data;
      this.pensionFunds.unshift({ text: 'Selecciona', value: '' });
    });
  }
  getSeveranceFounds() {
    this._severanceFund.getSeveranceFounds().subscribe((r: any) => {
      this.severanceFunds = r.data;
      this.severanceFunds.unshift({ text: 'Selecciona', value: '' });
    });
  }
  getEpss() {
    this._epss.getEpss().subscribe((r: any) => {
      this.epss = r.data;
      this.epss.unshift({ text: 'Selecciona', value: '' });
    });
  }
  save() {
    if (this.formPrestation.invalid) {
      this.formPrestation.markAllAsTouched();
      this.swalService.incompleteError();
      return false;
    }
    this.person = { ...this.person, ...this.formPrestation.value };
    this._person.person.next(this.person);
    this.siguiente.emit({});
  }

  crearForm() {
    this.formPrestation = this.fb.group({
      eps_id: ['', Validators.required],
      compensation_fund_id: ['', Validators.required],
      severance_fund_id: ['', Validators.required],
      pension_fund_id: ['', Validators.required],
      arl_id: ['', Validators.required],
    });
  }

  get eps_id_invalid() {
    return this.formPrestation.get('eps_id').invalid && this.formPrestation.get('eps_id').touched;
  }
  get compensation_fund_id_invalid() {
    return (
      this.formPrestation.get('compensation_fund_id').invalid &&
      this.formPrestation.get('compensation_fund_id').touched
    );
  }
  get severance_fund_id_invalid() {
    return (
      this.formPrestation.get('severance_fund_id').invalid &&
      this.formPrestation.get('severance_fund_id').touched
    );
  }
  get pension_fund_id_invalid() {
    return (
      this.formPrestation.get('pension_fund_id').invalid &&
      this.formPrestation.get('pension_fund_id').touched
    );
  }
  get arl_id_invalid() {
    return this.formPrestation.get('arl_id').invalid && this.formPrestation.get('arl_id').touched;
  }

  previus() {
    this.anterior.emit();
  }
  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }
}

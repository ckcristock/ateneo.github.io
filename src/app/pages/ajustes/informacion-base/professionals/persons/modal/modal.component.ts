import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { DataDinamicService } from 'src/app/services/data-dinamic.service';
import { OpenAgendaService } from 'src/app/pages/agendamiento/open-agenda.service';
import { EpssService } from '../../../services/epss.service';
import { ValidatorsService } from '../../../services/reactive-validation/validators.service';
import { SwalService } from '../../../services/swal.service';
import { Person } from '../person.model';
import { PersonService } from '../person.service';
import { SearchPipe } from '../../../../../../shared/pipes/search.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShowErrorsComponent } from '../../../../../../components/show-errors/show-errors.component';

import { LoadImageComponent } from '../../../../../../shared/components/load-image/load-image.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LoadImageComponent,
    ShowErrorsComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatInputModule,
    NgSelectModule,
    SearchPipe,
  ],
})
export class ModalComponent implements OnInit {
  searchDepartamento: any;
  searchMunicipio: any;
  searchMiempresa: any;
  fileAvatar: string | ArrayBuffer =
    'https://ui-avatars.com/api/?background=505D69&color=fff&size=1000&name=Dr';
  fileSgnature: string | ArrayBuffer =
    'https://ui-avatars.com/api/?background=505D69&color=fff&size=1000&name=F';

  file: any = '';
  forma: UntypedFormGroup;
  public regimes: any[] = [];
  public tempContracts: Array<object> = [];
  public type_appointments = [];
  public contracts: Array<object> = [];

  constructor(
    private _dataDinamic: DataDinamicService,
    private _epssService: EpssService,
    public _person: PersonService,
    private fb: UntypedFormBuilder,
    private _valReactive: ValidatorsService,
    private _swal: SwalService,
    private _openAgendaService: OpenAgendaService,
    private router: Router,
    private config: NgSelectConfig,
  ) {
    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
    this.config.loadingText = 'Loading...';
    this.config.bindValue = 'value';
  }

  ngOnInit(): void {
    this.person = new Person();
    this.getData();
    this.buildForm();
    if (this._person.id) {
      this.show();
    }
  }

  public person: Person;
  companies: any = [];
  allcompanies: any = [];
  specialities: any = [];
  peopleTypes: any = [];
  cities: any = [];
  departments: any = [];

  typesDocuments: Array<any> = [];

  civilStates: Array<any> = [
    { name: 'Seleccione', value: '' },
    { name: 'Soltero(a)', value: 'Soltero(a)' },
    { name: 'Casado(a)', value: 'Casado(a)' },
    { name: 'Viudo(a)', value: 'Viudo(a)' },
    { name: 'Divorciado(a)', value: 'Divorciado(a)' },
    { name: 'Union libre', value: 'Union Libre' },
  ];

  @Output()
  dataChange: EventEmitter<any> = new EventEmitter<any>();

  buildForm(): void {
    this.forma = this.fb.group({
      id: [],
      image_blob: [''],
      signature_blob: [''],
      type_document_id: [, this._valReactive.required],
      identifier: ['', this._valReactive.required],
      medical_record: ['', this._valReactive.required],
      birth_date: ['', this._valReactive.required],
      first_name: ['', this._valReactive.required],
      second_name: [],
      first_surname: ['', this._valReactive.required],
      second_surname: [],
      marital_status: ['', this._valReactive.required],
      phone: ['', this._valReactive.required],
      cell_phone: ['', this._valReactive.required],
      email: ['', this._valReactive.required],
      department_id: ['', this._valReactive.required],
      municipality_id: ['', this._valReactive.required],
      specialities: ['', this._valReactive.required],
      contract: this.fb.array([], Validators.required),
      // company_id: [, this._valReactive.required],
      // companies: ['', this._valReactive.required],
    });
  }

  show = async () => {
    if (!this._person.id) {
      console.log('No existe id');
    } else {
      await this._person
        .getProfessional(this._person.id)
        .toPromise()
        .then((req: any) => {
          this.person = req.data;
          this.person.specialities = this.transformData(req.data.specialities);
          this.person.companies = this.transformData(req.data.companies);
          let restrictions = req.data.restriction;
          restrictions.forEach((element) => {
            this.newContractUpdate(element);
          });
          this.forma.patchValue({
            id: this._person.id,
            image_blob: this.person.image_blob,
            signature_blob: this.person.signature_blob,
            type_document_id: this.person.type_document_id,
            identifier: this.person.identifier,
            medical_record: this.person.medical_record,
            birth_date: this.person.birth_date,
            first_name: this.person.first_name,
            second_name: this.person.second_name,
            first_surname: this.person.first_surname,
            second_surname: this.person.second_surname,
            marital_status: this.person.marital_status,
            phone: this.person.phone,
            cell_phone: this.person.cell_phone,
            email: this.person.email,
            department_id: this.person.department_id,

            specialities: this.person.specialities,
            contract: this.person.contract,
          });
        });
      this.getCities();
    }
  };

  getData = () => {
    this.getDepartments();
    this.getSpecialties();
    this.getCompanies();
    this.getAllCompanies();
    this.getPeopleTypes();
    this.getTypeDocuments();
    this.getContracts();
    this.getRegimes();
    this.getTypeAppointment();
    this.getEpsContracts();
  };

  getRegimes() {
    this._dataDinamic.getRegimens().subscribe((req: any) => {
      this.regimes = req.data;
    });
  }

  getTypeAppointment() {
    this._openAgendaService.getTypeAppointment('').subscribe((resp: any) => {
      this.type_appointments = resp.data;
    });
  }

  getEpsContracts() {
    this._epssService.getEpsContracts('').subscribe((resp: any) => {
      this.contracts = resp.data;
    });
  }

  toSave = () => {
    const datas = new FormData();
    this._person.storePeople(this.forma.value).subscribe((res: any) => {
      this.dataChange.emit('');
      this.successfull(res.code);
      this.router.navigate(['/ajustes/informacion-base/professionals']);
    });
  };

  toEdit = () => {
    const datas = new FormData();
    this._person.storePeople(this.forma.value).subscribe((res: any) => {
      this.dataChange.emit('');
      this.successfull(res.code);
      this.router.navigate(['/ajustes/informacion-base/professionals']);
    });
  };

  successfull(code) {
    if (code == 200) {
      this.hide();
      this._swal.show({
        title: 'Operación exitosa',
        text: 'Guardado Correctamente',
        icon: 'success',
        showCancel: false,
      });
    }
  }

  hide = () => {
    this.person = new Person();
    this.forma.reset();
  };

  guardar = () => {
    this.forma.markAllAsTouched();
    /* if (this.forma.invalid) return false; */
    this._swal
      .show({
        title: '¿Desea Guardar?',
        text: 'Se Dispone a guardar el nuevo ',
        icon: 'warning',
      })
      .then((r) => {
        if (r.isConfirmed) {
          if (this._person.id) {
            this.toEdit();
          } else {
            this.toSave();
          }
        }
      });
  };

  getContracts = async () => {
    await this._dataDinamic
      .getContracts()
      .toPromise()
      .then((req: any) => {
        this.contracts = this.tempContracts = req.data;
        this.contracts.unshift({ text: 'Seleccione', value: '' });
      });
  };

  getCities = () => {
    if (this.forma.get('department_id').value) {
      this._dataDinamic
        .getCities({ department_id: this.forma.get('department_id').value })
        .subscribe((req: any) => {
          this.cities = req.data;
          this.cities.unshift({ text: 'Seleccione', value: '' });
          this.forma.patchValue({
            municipality_id: this.person.municipality_id,
          });
        });
    }
  };

  getDepartments = async () => {
    await this._dataDinamic
      .getDepartments()
      .toPromise()
      .then((req: any) => {
        this.departments = req.data;
        this.departments.unshift({ text: 'Seleccione', value: '' });
      });
  };

  getPeopleTypes = () => {
    this._dataDinamic.getPeopleTypes().subscribe((req: any) => {
      this.peopleTypes = req.data;
      this.peopleTypes.unshift({ text: 'Seleccione', value: '' });
    });
  };

  getCompanies = () => {
    this._dataDinamic.getCompanies(1).subscribe((req: any) => {
      this.companies = req.data;
    });
  };

  getAllCompanies = () => {
    this._dataDinamic.getCompanies(3).subscribe((req: any) => {
      this.allcompanies = req.data;
    });
  };
  getSpecialties = () => {
    this._dataDinamic.getSpecialties('', '').subscribe((resp: any) => {
      this.specialities = resp.data;
    });
  };

  getTypeDocuments = () => {
    this._dataDinamic.getTypeDocuments().subscribe((resp: any) => {
      this.typesDocuments = resp.data;
      this.typesDocuments.unshift({ text: 'Seleccione', value: '' });
    });
  };

  onFileChanged(event, field, $model = '') {
    this.setNameFile(event, $model);

    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        switch (field) {
          case 'signature_blob':
            this.fileSgnature = (<FileReader>event.target).result;
            this.forma.patchValue({
              signature_blob: (<FileReader>event.target).result,
            });
            break;

          case 'image_blob':
            this.fileAvatar = (<FileReader>event.target).result;
            this.forma.patchValue({
              image_blob: (<FileReader>event.target).result,
            });
            break;
        }
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
      });
    }
  }

  newContract() {
    let list = this.contractList;
    list.push(this.getContract());
  }

  newContractUpdate(data) {
    let list = this.contractList;
    list.push(this.getContractUpdate(data));
  }

  deleteContract() {
    this.contractList.removeAt(this.contractList.length - 1);
  }

  getContract(): UntypedFormGroup {
    let group = this.createContractGroup(this.fb);
    return group;
  }

  getContractUpdate(data): UntypedFormGroup {
    let group = this.createContractGroupUpdate(this.fb, data);
    return group;
  }

  createContractGroup(fb: UntypedFormBuilder) {
    let group = fb.group({
      regimen_id: ['', Validators.required],
      company_id: ['', Validators.required],
      companies_id: ['', Validators.required],
      type_agenda_id: [, Validators.required],
      contract_id: [, Validators.required],
      contracts: [[]],
    });

    group.get('company_id').valueChanges.subscribe((value) => {
      let tem = this.tempContracts.filter((element: any) => {
        if (group.get('companies_id').value && group.get('regimen_id').value) {
          return (
            (value == element.company_id ||
              group.get('companies_id').value.includes(element.company_id)) &&
            group.get('regimen_id').value.includes(element.regimen_id)
          );
        }
      });
      group.get('contracts').setValue(tem);
    });

    group.get('regimen_id').valueChanges.subscribe((value) => {
      let tem = this.tempContracts.filter((element: any) => {
        if (group.get('companies_id').value && group.get('regimen_id').value) {
          return (
            (group.get('company_id').value == element.company_id ||
              group.get('companies_id').value.includes(element.company_id)) &&
            value.includes(element.regimen_id)
          );
        }
      });
      group.get('contracts').setValue(tem);
    });

    group.get('companies_id').valueChanges.subscribe((value) => {
      let tem = this.tempContracts.filter((element: any) => {
        if (group.get('companies_id').value && group.get('regimen_id').value) {
          return (
            (group.get('companies_id').value == element.company_id ||
              value.includes(element.company_id)) &&
            group.get('regimen_id').value.includes(element.regimen_id)
          );
        }
      });
      group.get('contracts').setValue(tem);
    });

    return group;
  }

  createContractGroupUpdate(fb: UntypedFormBuilder, data) {
    let group = fb.group({
      company_id: [null, Validators.required],
      regimen_id: [null, Validators.required],
      companies_id: [null, Validators.required],
      type_agenda_id: [null, Validators.required],
      contract_id: [null, Validators.required],
      contracts: [[]],
    });

    // TODO: refactor this

    group.get('company_id').valueChanges.subscribe((value) => {
      let tem = this.tempContracts.filter((element: any) => {
        if (group.get('companies_id').value && group.get('regimen_id').value) {
          return (
            (value == element.company_id ||
              group.get('companies_id').value.includes(element.company_id)) &&
            group.get('regimen_id').value.includes(element.regimen_id)
          );
        }
      });
      group.get('contracts').setValue(tem);
    });

    group.get('company_id').valueChanges.subscribe((value) => {
      let tem = this.tempContracts.filter((element: any) => {
        if (group.get('companies_id').value && group.get('regimen_id').value) {
          return (
            (value == element.company_id ||
              group.get('companies_id').value.includes(element.company_id)) &&
            group.get('regimen_id').value.includes(element.regimen_id)
          );
        }
      });
      group.get('contracts').setValue(tem);
    });

    group.get('regimen_id').valueChanges.subscribe((value) => {
      let tem = this.tempContracts.filter((element: any) => {
        if (group.get('companies_id').value && group.get('regimen_id').value) {
          return (
            (group.get('company_id').value == element.company_id ||
              group.get('companies_id').value.includes(element.company_id)) &&
            value.includes(element.regimen_id)
          );
        }
      });
      group.get('contracts').setValue(tem);
    });

    group.get('companies_id').valueChanges.subscribe((value) => {
      let tem = this.tempContracts.filter((element: any) => {
        if (group.get('companies_id').value && group.get('regimen_id').value) {
          return (
            (group.get('companies_id').value == element.company_id ||
              value.includes(element.company_id)) &&
            group.get('regimen_id').value.includes(element.regimen_id)
          );
        }
      });
      group.get('contracts').setValue(tem);
    });

    group.patchValue({
      company_id: data.company.id,
      regimen_id: this.transformData(data.regimentypes),
      companies_id: this.transformData(data.companies),
      type_agenda_id: this.transformData(data.typeappointments),
      contract_id: this.transformData(data.contracts),
    });
    return group;
  }

  get contractList() {
    return this.forma.get('contract') as UntypedFormArray;
  }

  transformData = (array: Array<object>): any => array.map(({ ...obj }) => obj['id']);

  setNameFile(event, $model) {
    const { name: name, size } = event.target.files[0];
    this[$model] = name;
  }
}

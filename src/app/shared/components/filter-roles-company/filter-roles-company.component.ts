import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { pairwise, startWith } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { Select } from '@shared/interfaces/global.interface';
import { GroupCompany } from '@shared/interfaces/group-company.interface';
import { GroupCompanyService } from '@shared/services/group-company.service';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/services/person/person.service';
import { SearchSelectComponent } from '../search-select/search-select.component';

export type FilterRolName = Partial<{
  group_id: number | string;
  dependency_id: number | string;
  person_id: number | string | number[];
  position: number | string;
}>;

export type hideSelect = Partial<Record<keyof FilterRolName, boolean>>;

export interface RequiredSelect extends hideSelect { }

type FormRoles = Record<keyof FilterRolName, any>;

@Component({
  selector: 'app-filter-roles-company',
  templateUrl: './filter-roles-company.component.html',
  styleUrls: ['./filter-roles-company.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    SearchSelectComponent,
  ],
})
export class FilterRolesCompanyComponent implements OnInit {
  @Input('companyId') set companyIdChange(newCompanyId: number) {
    this.companyId = newCompanyId;
    if (newCompanyId) this.getGroups();
  }

  @Input() multiSelectPerson: boolean = false;

  @Input() formRef!: FormGroup;

  @Input() defaultValues: FilterRolName = {
    dependency_id: '',
    group_id: '',
    person_id: 0,
    position: '',
  };

  @Input() requiredSelect: RequiredSelect = {};

  @Input() hideSelect: hideSelect = {};

  @Input() showAll: boolean = true;

  @Output() newValues: EventEmitter<FilterRolName> = new EventEmitter();

  formRoles!: FormGroup<FormRoles>;

  groups: GroupCompany[] = [];

  dependencies: Select[] = [];

  positions: Select[] = [];

  people: Select[] = [];

  companyId = null;

  firstLoad: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly groupCompanyService: GroupCompanyService,
    private readonly personService: PersonService,
  ) { }

  ngOnInit(): void {
    this.handleDefaultValues();
    this.initFormRoles();
    if (this.companyId == null) this.getGroups();
  }

  private handleDefaultValues(): void {
    if (!this.defaultValues)
      this.defaultValues = {
        dependency_id: '',
        group_id: '',
        person_id: 0,
        position: '',
      };
  }

  private initFormRoles(): void {
    this.formRoles = this.formBuilder.group({
      group_id: [''],
      dependency_id: [''],
      person_id: [''],
      position: [''],
    });
    this.setValidators();
  }

  private setValidators(): void {
    Object.keys(this.requiredSelect).forEach((key) => {
      const control = this.formRoles.get(key);
      control.setValidators([Validators.required]);
      control.updateValueAndValidity();
    });
  }

  private getGroups(): void {
    this.groupCompanyService.getGroupCompany(this.companyId).subscribe({
      next: (res) => {
        this.groups = res.data;
        this.getChangesForm();
        this.setFormRoles();
      },
    });
  }

  private getChangesForm(): void {
    this.formRoles.valueChanges
      .pipe(startWith({ person_id: this.defaultValues.person_id } as FilterRolName), pairwise())
      .subscribe({
        next: (res) => {
          const previousValue = res[0];
          const nextValue = res[1];
          if (previousValue.group_id != nextValue.group_id) this.getDependencies();
          if (previousValue.dependency_id != nextValue.dependency_id) this.onSelectDependency();
          if (previousValue.person_id == nextValue.person_id) this.getPeople();
          if (this.firstLoad) this.newValues.emit(nextValue as FilterRolName);
          this.firstLoad = true;
        },
      });
  }

  private setFormRoles(): void {
    if (this.formRef) {
      this.formRoles.patchValue(this.formRef.value)
      this.formRoles = this.formRef
      this.getChangesForm()
    }
    else
      this.formRoles.patchValue(this.defaultValues);
  }

  private getPeople(): void {
    if (this.hideSelect.person_id) return;
    let params: any = {};
    if (this.groupId) params.group_id = +this.groupId;
    if (this.dependencyId) params.dependency_id = +this.dependencyId;
    if (this.positionId) params.position = +this.positionId;
    this.personService.getPersonCompany(params).subscribe({
      next: (res) => {
        this.people = res['data'];
      },
    });
  }

  private getDependencies(): void {
    this.dependencies = this.handleNewListRoles({
      array: this.groups,
      currentValue: this.groupId,
      propName: 'dependencies',
    });
  }

  private onSelectDependency(): void {
    this.positions = this.handleNewListRoles({
      array: this.dependencies,
      currentValue: this.dependencyId,
      propName: 'positions',
    });
  }

  private handleNewListRoles(props: {
    array: any[];
    currentValue: string;
    propName: string;
  }): Select[] {
    const { array, currentValue, propName } = props;
    let roles = [];
    if (!array.length || !currentValue)
      roles = array
        .filter((datum) => datum.value != 0)
        .map((datum) => datum[propName])
        .flat(1);
    else roles = array.find((group) => group.value === +currentValue)?.[propName];
    return roles;
  }

  private get groupId(): string {
    return this.formRoles.get('group_id').value as string;
  }

  private get dependencyId(): string {
    return this.formRoles.get('dependency_id').value as string;
  }

  private get positionId(): string {
    return this.formRoles.get('position').value as string;
  }
}

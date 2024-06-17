import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AutocompleteFcComponent } from 'src/app/components/autocomplete-fc/autocomplete-fc.component';
import { DepartmentMunicipalityService } from './department-municipality.service';

export interface MunDep {
  country_id?: string;
  department_id: string;
  municipality_id: string;
}

@Component({
  selector: 'app-department-municipality',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutocompleteFcComponent],
  templateUrl: './department-municipality.component.html',
  styleUrl: './department-municipality.component.scss',
})
export class DepartmentMunicipalityComponent implements OnInit {
  @Input() values: MunDep = null;

  @Input() loading = false;

  @Input() showCountry = false;

  @Input() required = false;

  @Output() loadData = new EventEmitter();

  @Output() changeSelection = new EventEmitter();

  formDepMun = new FormGroup<Record<string, any>>({
    department_id: new FormControl('', [Validators.required]),
    municipality_id: new FormControl('', [Validators.required]),
  });

  countries = [];

  departments = [];

  municipalities = [];

  countryId = '1';

  loadingDep = false;

  loadingMun = false;

  loadingRequest = true;

  constructor(private readonly departmetMunicipalityService: DepartmentMunicipalityService) {}

  ngOnInit(): void {
    if (this.showCountry) {
      this.getCountries();
      this.formDepMun.addControl('country_id', new FormControl('', [Validators.required]));
    }
    if (this.values) {
      if (this.values.country_id) this.countryId = this.values.country_id;
      this.formDepMun.patchValue(this.values);
      this.onSelectDept(this.values.municipality_id);
    }
    this.getDepartments();
  }

  private getCountries(): void {
    this.departmetMunicipalityService.getCountries().subscribe({
      next: (res) => {
        this.countries = res.data;
        this.loadData.emit();
        this.loadingRequest = false;
      },
    });
  }

  private getDepartments(): void {
    this.departmetMunicipalityService.getDepartments(this.countryId).subscribe({
      next: (res) => {
        this.departments = res.data;
        if (this.showCountry) {
          this.loadingDep = false;
          this.formDepMun.get('department_id').enable();
          return;
        }
        this.loadData.emit();
        this.loadingRequest = false;
      },
    });
  }

  onSelectCountry() {
    const munControl = this.formDepMun.get('municipality_id');
    const depControl = this.formDepMun.get('department_id');
    depControl.setValue('');
    munControl.setValue('');
    depControl.enable();
    munControl.enable();
    this.loadingDep = true;
    this.countryId = this.formDepMun.get('country_id').value as string;
    this.emitChangeSelection();
    this.getDepartments();
  }

  onSelectDept(defaultMun?: string): void {
    const munControl = this.formDepMun.get('municipality_id');
    munControl.setValue(defaultMun ?? '');
    munControl.disable();
    this.loadingMun = true;
    const deptId = +this.formDepMun.get('department_id').value;
    this.emitChangeSelection();
    this.departmetMunicipalityService.getMunicipalities(deptId).subscribe({
      next: (res) => {
        munControl.enable();
        this.municipalities = res;
        this.loadingMun = false;
      },
    });
  }

  emitChangeSelection(): void {
    this.changeSelection.emit(this.formDepMun.getRawValue());
  }
}

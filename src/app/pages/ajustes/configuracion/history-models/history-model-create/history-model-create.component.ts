import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { HistoryTabComponent } from './components/history-tab/history-tab.component';
import { debounceTime } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import {
  Speciality,
  SpecialityService,
} from '@app/pages/ajustes/informacion-base/speciality/speciality.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { HistoryModelsService } from '../history-models.service';

@Component({
  selector: 'app-history-model-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonModule,
    HistoryTabComponent,
    NgbDropdownModule,
    MatBottomSheetModule,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    NotDataComponent,
  ],
  templateUrl: './history-model-create.component.html',
  styleUrl: './history-model-create.component.scss',
})
export class HistoryModelCreateComponent implements OnInit {
  specialities!: Speciality[];

  form!: UntypedFormGroup;

  fixedSections: any[] = [];

  types: any[] = [];

  loading = signal(false);

  constructor(
    private readonly specialityService: SpecialityService,
    private readonly fb: FormBuilder,
    private readonly _bottomSheet: MatBottomSheet,
    private readonly historyModelService: HistoryModelsService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    this.getSpecialities();
    this.getSections();
    this.createForm();
    await this.getVariablesTypes();
    this.loading.set(false);
  }

  getVariablesTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.historyModelService.getVariablesTypes().subscribe({
        next: (res: any) => {
          this.types = res.data;
          resolve(res);
        },
        error: (err) => reject(err),
      });
    });
  }

  getSections() {
    this.historyModelService.sectionList({ fixed: 1 }).subscribe({
      next: (r: any) => {
        this.fixedSections = r.data;
        r.data.forEach((tab) => {
          this.sections.push(
            this.fb.group({
              id: [tab.id],
              name: [tab.name],
              editable: [false],
              fixed: [tab.fixed],
              variables: this.fb.array([]),
            }),
          );
        });
      },
    });
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheet, { data: this.sections });
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      speciality: ['', [Validators.required]],
      sections: this.fb.array([]),
    });
  }

  getSpecialities() {
    this.specialityService.getSpecialities().subscribe({
      next: (r) => {
        this.specialities = r.data;
      },
    });
  }

  addTab() {
    this.sections.push(
      this.fb.group({
        id: [''],
        name: ['Nueva sección'],
        editable: [false],
        fixed: [false],
        variables: this.fb.array([]),
      }),
    );
  }

  deleteSection(sectionIndex: any) {
    this.sections.removeAt(sectionIndex);
  }

  createTabSection(section: any, index: number) {
    return { section, index };
  }

  onDoubleClick(section: FormGroup) {
    if (section.get('fixed').value) return;
    section.get('editable').setValue(true);
  }

  onBlur(section: FormGroup) {
    section.get('editable').setValue(false);
  }

  save() {
    console.log(this.form.value);
  }

  get name() {
    return this.form.get('name');
  }

  get speciality() {
    return this.form.get('speciality');
  }

  get sections() {
    return this.form.get('sections') as FormArray;
  }
}

@Component({
  selector: 'bottom-sheet',
  templateUrl: 'bottom-sheet.html',
  standalone: true,
  imports: [
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    NotDataComponent,
    ReactiveFormsModule,
  ],
})
export class BottomSheet implements OnInit {
  sections!: any[];

  loading = signal(false);

  formSearch!: FormGroup;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: FormArray,
    private fb: FormBuilder,
    private readonly historyModelService: HistoryModelsService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getSections();
  }

  createForm() {
    this.formSearch = this.fb.group({
      name: [''],
      fixed: [0],
    });
    this.formSearch.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.getSections();
    });
  }

  getSections() {
    this.loading.set(true);
    this.historyModelService.sectionList(this.formSearch.value).subscribe({
      next: (r: any) => {
        this.sections = r.data;
        this.loading.set(false);
      },
    });
  }

  openLink(section): void {
    if (this.data.value.findIndex((item) => item.id === section.id) === -1) {
      this.data.push(
        this.fb.group({
          id: [section.id],
          name: [section.name],
          editable: [false],
          fixed: [section.fixed],
          variables: this.fb.array([]),
        }),
      );
    } else {
      this.swalService.error('Esta sección ya esta agregada', '');
    }
    this._bottomSheetRef.dismiss(section);
  }
}

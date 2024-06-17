import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Response } from 'src/app/core/response.model';
import { ClinicalHistoryService } from './../clinical-history.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-new-clinical-history',
  templateUrl: './new-clinical-history.component.html',
  styleUrls: ['./new-clinical-history.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgFor,
    MatOptionModule,
    NgIf,
    ReactiveFormsModule,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    NgSelectModule,
    NgbNavOutlet,
  ],
})
export class NewClinicalHistoryComponent implements OnInit {
  public subtypes = [];
  public histories = [];
  public modules = [];
  public subtype: any;
  public history: any;
  public types = [];
  public type: any;
  public show: boolean = false;
  dataForm: UntypedFormGroup;

  active = 1;
  constructor(
    private _clinicalHistoryervice: ClinicalHistoryService,
    private formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit() {
    this.ClinicalHistorials();
  }

  ClinicalHistorials = () => {
    this._clinicalHistoryervice.ClinicalHistorials().subscribe((res: Response) => {
      this.histories = res.data;
    });
  };

  ClinicalHistorialsTypes = () => {
    this._clinicalHistoryervice
      .ClinicalHistorialsTypes({ id: this.history })
      .subscribe((res: Response) => {
        this.types = res.data;
      });
  };

  ClinicalHistorialsSubTypes = () => {
    this._clinicalHistoryervice
      .ClinicalHistorialsSubTypes({ id: this.type })
      .subscribe((res: Response) => {
        this.subtypes = res.data;
      });
  };

  chargeFields = () => {
    this._clinicalHistoryervice.chargeFields({ id: this.history }).subscribe((res: Response) => {
      this.modules = res.data;
      this.createForm();
      this.show = true;
    });
  };

  createForm() {
    let modulesForm = this.formBuilder.array([]);
    this.modules.forEach((module) => {
      modulesForm.push(
        this.formBuilder.group({
          module: module.name,
          variables: this.initFields(module['variables_clinical_history_model']),
        }),
      );
    });

    this.dataForm = this.formBuilder.group({ modulesForm });
  }

  getShow = (vary) => {
    return vary.dependence == 'false' ? true : false;
  };

  initFields = (variables) => {
    console.log('aqui');
    let fieldForms = new UntypedFormArray([]);
    variables.forEach((vary) => {
      let mygroup = this.formBuilder.group({
        ...vary,
        show: this.getShow(vary),
        values_for_select: this.formBuilder.array(vary.values_for_select),
        parents: this.formBuilder.array(vary.parents),
      });

      fieldForms.push(mygroup);

      mygroup.get('valor').valueChanges.subscribe((data) => {
        let controls = mygroup.parent.controls;
        let parentG = mygroup.parent as UntypedFormArray;

        for (let iterator = 0; iterator < Number(controls.length); iterator++) {
          const element = parentG.at(iterator) as UntypedFormGroup;

          let parents: any = element.controls.parents as UntypedFormGroup;
          parents = parents.controls;

          if (parents.length) {
            for (let index = 0; index < parents.length; index++) {
              let parent = parents[index];

              if (parent.value.parent_id == mygroup.value.id) {
                let options = element.value.parents;

                let result = mygroup.value.values_for_select.find((element) => {
                  return element.id == data;
                });

                let dependences = options.filter((iter) => {
                  return iter.valueDependence == result.name;
                });

                if (dependences.length == 0) {
                  element.patchValue({ show: false });
                } else {
                  element.patchValue({ show: true });
                }
              }
            }
          }
          if (element.controls.dependence.value == 'false') {
            element.patchValue({ show: true });
          }
        }
      });
    });

    return fieldForms;
  };

  public get dataFormModules() {
    return this.dataForm.get('modulesForm') as UntypedFormArray;
  }

  onSubmit = () => {
    console.log(this.dataFormModules.at(this.active - 1).value);
  };
}

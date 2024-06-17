import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VariablesHightCostServiceService } from './variables-hight-cost-service.service';
import { NgFor, NgIf } from '@angular/common';
import { MatInputComponent } from './components/mat-input/mat-input.component';
import { MatSelectComponent } from './components/mat-select/mat-select.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-formato-historia',
  templateUrl: './formato-historia.component.html',
  styleUrls: ['./formato-historia.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    MatInputComponent,
    MatSelectComponent,
    MatDividerModule,
  ],
})
export class FormatoHistoriaComponent implements OnInit {
  forma!: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private _sendVariablesHightCostService: VariablesHightCostServiceService,
  ) {}
  operatorsSelect = ['equal', 'not equal'];
  operators = ['is equeal to', 'is not equal to', 'begins with', '<', '>', '<=', '>='];
  typeInputs = ['text', 'date', 'check', 'select', 'number', 'textarea'];
  condicionals = ['and', 'or'];

  id = 0;
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.forma = this.fb.group({
      questions: this.fb.array([this.makeCuestion()]),
    });

    // this.forma.valueChanges.subscribe((r) => console.log(r));
  }

  makeCuestion() {
    this.id += 1;
    let id = this.id;
    let gb = this.fb.group({
      id,
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      type: 'text',
      options: this.fb.array([this.fb.group({ value: '' })]),
      validations: this.fb.array([this.makeRules()]),
    });
    let options = gb.get('options') as UntypedFormArray;
    gb.get('type')?.valueChanges.subscribe((r) => {
      if (r != 'select' && r != 'check') {
        let opt = options.at(0);
        options.clear();
        options.push(opt);
      }
    });

    return gb;
  }

  get questions() {
    return this.forma.get('questions') as UntypedFormArray;
  }

  addQuestion() {
    this.questions.push(this.makeCuestion());
  }

  addRule(condition: UntypedFormArray) {
    condition.push(this.makeCondition());
  }

  makeCondition() {
    let g = this.fb.group({
      logic: 'and',
      operator: 'equal',
      value: '',
      id_question_selected: '',
      question_selected: '',
    });

    g.get('id_question_selected')?.valueChanges.subscribe((r) => {
      const questions = this.forma.get('questions') as UntypedFormArray;
      const question = questions.controls.find((x: any) => x.controls.id.value == r);
      g.patchValue({
        question_selected: question?.value,
      });
    });
    return g;
  }

  addOption(options: UntypedFormArray) {
    options.push(this.fb.group({ value: '' }));
  }

  addRu(questionCondition: UntypedFormArray) {
    let g = this.fb.group({
      logic: 'and',
      level2: this.fb.array([this.makeCondition()]),
    });
    questionCondition.push(g);
  }

  delete(col: UntypedFormArray, pos: any) {
    // console.log(col);
    col.removeAt(pos);
  }

  makeRules() {
    return this.fb.group({
      rules: this.fb.array([
        this.fb.group({
          logic: 'and',
          level2: this.fb.array([this.makeCondition()]),
        }),
      ]),
      then: '',
    });
  }

  addValidation(validations: UntypedFormArray) {
    validations.push(this.makeRules());
  }

  save = () => {
    console.log(this.forma.value);
    /* this._sendVariablesHightCostService
      .store(this.forma.value)
      .subscribe((arg) => console.log(arg)); */
  };
}

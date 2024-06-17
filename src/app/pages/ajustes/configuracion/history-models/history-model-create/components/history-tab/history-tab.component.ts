import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableDirective } from '@app/core/directives/resizable.directive';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { consts } from '@app/core/utils/consts';

@Component({
  selector: 'app-history-tab',
  standalone: true,
  imports: [
    CommonModule,
    ResizableDirective,
    AddButtonComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
  ],
  templateUrl: './history-tab.component.html',
  styleUrl: './history-tab.component.scss',
})
export class HistoryTabComponent {
  @Input() section!: FormGroup;

  @Input() types: any [] = [];

  sizes = consts.sizes

  constructor(
    private readonly fb: FormBuilder,
    private readonly swalService: SwalService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  addVariable() {
    if (this.variables.valid) {
      this.variables.push(
        this.fb.group({
          name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
          type: ['', [Validators.required]],
          size: ['col-md-6', [Validators.required]],
          required: [false, [Validators.required]],
          conditions: this.fb.array([]),
        }),
      );
    } else {
      this.variables.markAllAsTouched();
      this.swalService.show({
        icon: 'warning',
        title: 'Debe completar todos los campos',
        text: 'Antes de agregar una nueva variable debe completar las anterior',
        showCancel: false,
      });
    }
  }

  onTypeChange(event: any, variable) {
    const type = this.types.find((t) => t.value === event.value);
    const conditions = variable.get('conditions') as FormArray;
    conditions.clear();
    if (type && type.conditions) {
      for (const condition of type.conditions) {
        conditions.push(
          this.fb.group({
            name: [condition.name],
            type: [condition.type],
            value: ['', [Validators.required]],
          }),
        );
      }
    }
  }

  deleteVariable(index: number) {
    this.variables.removeAt(index);
    this.changeDetector.detectChanges();
  }

  get variables() {
    return this.section.get('variables') as FormArray;
  }
}







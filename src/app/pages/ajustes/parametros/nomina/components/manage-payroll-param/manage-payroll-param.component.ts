import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-manage-payroll-param',
  standalone: true,
  imports: [CommonModule, ModalComponent, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './manage-payroll-param.component.html',
  styleUrl: './manage-payroll-param.component.scss',
})
export class ManagePayrollParamComponent implements OnInit {
  @Input() titleModal = '';

  @Input() dataEdit = {};

  @Output() sendData = new EventEmitter();

  formPayroll = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.formPayroll.patchValue(this.dataEdit);
  }

  onSave(): void {
    this.sendData.emit(this.formPayroll.value);
  }
}

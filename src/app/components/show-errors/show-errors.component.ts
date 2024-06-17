import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.css'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class ShowErrorsComponent implements OnInit {
  @Input()
  ctrl!: any;

  ERROR_MESSAGE: any = {
    required: () => `-El campo es obligatorio`,
    minlength: (par: { requiredLength: any }) => `Min ${par.requiredLength} chars is required`,
  };

  constructor() {}

  ngOnInit() {}

  shouldShowErrors(): boolean {
    return (this.ctrl && this.ctrl.errors && this.ctrl.touched) ?? false;
  }

  listOfErrors(): any[] {
    return Object.keys(this.ctrl.errors).map((err) =>
      this.ERROR_MESSAGE[err](this.ctrl.getError(err)),
    );
  }
}

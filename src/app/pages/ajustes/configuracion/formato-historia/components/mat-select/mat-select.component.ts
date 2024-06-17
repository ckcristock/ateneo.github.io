import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, ReactiveFormsModule } from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-mat-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './mat-select.component.html',
  styleUrl: './mat-select.component.scss',
})
export class MatSelectComponent {
  @HostBinding('class') classes = 'col';

  @Input() class: string = 'w-100';

  @Input() label!: string;

  @Input() required: boolean = true;

  @Input() control = new FormControl('');

  @Input() items: string[] = [];

  @Input() itemsObjects: any[] = [];

  matcher = new MyErrorStateMatcher();
}





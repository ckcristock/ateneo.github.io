import { Component, HostBinding, Input } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-mat-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './mat-input.component.html',
  styleUrl: './mat-input.component.scss',
})
export class MatInputComponent {
  @HostBinding('class') classes = 'col';

  @Input() class: string = 'w-100';

  @Input() label!: string;

  @Input() type!: string;

  @Input() placeholder!: string;

  @Input() required: boolean = true;

  @Input () control = new FormControl('');

  matcher = new MyErrorStateMatcher();
}




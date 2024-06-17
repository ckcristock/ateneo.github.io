import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-autocomplete-fc',
  templateUrl: './autocomplete-fc.component.html',
  styleUrls: ['./autocomplete-fc.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    MatOptionModule,
  ],
})
export class AutocompleteFcComponent implements OnChanges {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  @Output() optionSelectedEvent = new EventEmitter();

  @Output() valueSelected = new EventEmitter();

  @Input() list: any[] = [];

  @Input() placeholder: string = 'Selecciona';

  @Input() label!: string;

  @Input() control = new FormControl();

  @Input() formControlName!: string;

  @Input() classList: string = '';

  inputControl = new FormControl('');

  filtered: any[];

  value: string = '';

  @Input() required: boolean = false;

  @Input() readOnly: boolean = false;

  constructor() {
    this.filtered = this.list.slice();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.required) {
      this.inputControl.setValidators([Validators.required]);
    }
    if (changes.list && this.list && this.list.length > 0)
      this.inputControl.setValue(
        this.list.find((o) => o.value === this.control.getRawValue())?.text ?? '',
      );
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filtered = this.list.filter((o) => o.text.toLowerCase().includes(filterValue));
  }

  optionSelected(event: MatAutocompleteSelectedEvent): void {
    this.control.setValue(this.inputControl.value);
    this.input.nativeElement.value = event.option.viewValue;
    this.value = event.option.viewValue;
    this.optionSelectedEvent.emit(this.value);
    this.valueSelected.emit(event.option.value);
  }

  opened() {
    this.value = this.input.nativeElement.value;
    this.input.nativeElement.value = '';
    this.filtered = this.list.slice();
  }

  closed() {
    this.input.nativeElement.value = this.value;
  }

  getErrorMessage() {
    if (this.inputControl.hasError('required')) {
      return 'Campo requerido';
    }
  }
}

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
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-autocomplete-mdl',
  templateUrl: './autocomplete-mdl.component.html',
  styleUrls: ['./autocomplete-mdl.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    NgFor,
    MatOptionModule,
  ],
})
export class AutocompleteMdlComponent implements OnChanges {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  @Output() optionSelectedEvent = new EventEmitter();

  @Input() list: any[] = [];

  @Input() placeholder: string = 'Selecciona';

  @Input() label!: string;

  @Input() model: any;

  @Input() required: boolean = false;

  @Input() classList: string = '';

  @Input() restoreValue: boolean = false;

  filtered: any[];

  value: string = '';

  inputModel: string = '';

  filterValue: any = null;

  constructor() {
    this.filtered = this.list.slice();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.list && this.list && this.list.length > 0) {
      this.model = this.list.find((o) => o.value == this.model)?.text;
      this.inputModel = this.model;
    }
    if (changes.restoreValue?.currentValue) this.inputModel = this.model;
  }

  filter(): void {
    const filterValue = this.inputValue.toLowerCase();
    this.filtered = this.list.filter((o) => o.text.toLowerCase().includes(filterValue));
  }

  optionSelected(event: MatAutocompleteSelectedEvent): void {
    this.input.nativeElement.value = event.option.viewValue;
    this.value = event.option.viewValue;
    this.optionSelectedEvent.emit(this.inputModel);
  }

  opened() {
    this.value = this.inputValue;
    this.input.nativeElement.value = '';
    this.filtered = this.list.slice();
  }

  closed() {
    this.input.nativeElement.value = this.value;
  }

  get inputValue() {
    return this.input.nativeElement.value;
  }
}

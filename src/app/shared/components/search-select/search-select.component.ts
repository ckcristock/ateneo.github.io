import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatOptionModule } from '@angular/material/core';

import { Select } from '@shared/interfaces/global.interface';
import { SearchPipe } from '../../pipes/search.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    NgFor,
    SearchPipe,
  ],
})
export class SearchSelectComponent implements OnInit {
  @Input() list: Select[] = [];

  @Input() control: FormControl<number | number[]> = new FormControl();

  @Input() defaultValue: number | number[] = 0;

  @Input() multiSelect: boolean = false;

  @Input() showAll: boolean = true;

  @Input() label: string = 'Seleccionar';

  @Input() placeholder: string = 'Buscar...';

  @Output() selected: EventEmitter<number> = new EventEmitter();

  search: FormControl<string> = new FormControl('') as FormControl;

  ngOnInit(): void {
    this.control.setValue(this.defaultValue);
  }

  resetSearchPerson(): void {
    this.search.reset();
  }

  toggleAllSelection(all: MatOption): void {
    if (!this.multiSelect) return;
    if (all.selected) {
      this.control.setValue([0].concat(this.list.map((people) => Number(people.value))));
    } else {
      this.control.setValue([]);
    }
  }

  onSelectPerson(all: MatOption): void {
    this.selected.emit(+this.control.value || 0);
    if (!this.multiSelect) return;
    if (!Array.isArray(this.control.value)) return;
    if (this.control.value[0] === 0) {
      (this.control.value as number[]).splice(0, 1);
      all.deselect();
    }
  }
}

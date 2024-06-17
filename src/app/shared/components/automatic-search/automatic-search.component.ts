import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-automatic-search',
  templateUrl: './automatic-search.component.html',
  styleUrls: ['./automatic-search.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
})
export class AutomaticSearchComponent implements OnInit, OnDestroy {
  @Input() label: string = 'Buscar';

  @Input() placeholder: string = 'Buscar';

  @Input() value: string = '';

  @Input() type: 'text' | 'number' = 'text';

  @Output() searching: EventEmitter<string> = new EventEmitter();

  searchControl: FormControl = new FormControl('');

  unsubscriber: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.searchControl.setValue(this.value);
    this.onSearching();
  }

  ngOnDestroy(): void {
    this.unsubscriber.unsubscribe();
  }

  private onSearching(): void {
    this.unsubscriber = this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (res) => {
        this.searching.emit(res);
      },
    });
  }
}

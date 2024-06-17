import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reload-button',
  templateUrl: './reload-button.component.html',
  styleUrls: ['./reload-button.component.scss'],
  standalone: true,
})
export class ReloadButtonComponent implements OnInit {
  @Input('reload') reload!: boolean;
  @Output('reloadData') reloadDataEvent = new EventEmitter();
  @Input('title') title = 'Recargar datos iniciales';
  constructor() {}

  ngOnInit(): void {}

  reloadData() {
    this.reloadDataEvent.emit();
  }
}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs';

import { GlobalService } from '@shared/services/global.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { AsyncPipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ProcessModule } from '../../process.module';

@Component({
  selector: 'app-process-header',
  standalone: true,
  imports: [MatExpansionModule, CardComponent, AddButtonComponent, AsyncPipe, ProcessModule],
  templateUrl: './process-header.component.html',
  styleUrl: './process-header.component.scss',
})
export class ProcessHeaderComponent implements OnInit {
  @Input() titlePage = '';

  @Input() filters = {
    person_id: '',
    date: '',
    state: '',
  };

  @Output() request = new EventEmitter();

  @Output() onAdd = new EventEmitter();

  people$ = new Observable();

  states = [
    { clave: 'Todos' },
    { clave: 'Pendiente' },
    { clave: 'Aprobado' },
    { clave: 'Legalizado' },
  ];

  constructor(
    private readonly globalService: GlobalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.people$ = this.globalService.getAllPeople$;
  }

  onClickAdd(): void {
    this.onAdd.emit();
  }

  onRequest(): void {
    this.request.emit();
  }
}

import { AfterViewInit, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { FilterButtonComponent } from '../filter-button/filter-button.component';
import { FiltersAccordionComponent } from '../filters-accordion/filters-accordion.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FilterButtonComponent, FiltersAccordionComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements AfterViewInit {
  @Input() viewTitle = '';

  @Input() activeFilters = false;

  @Input() filterTemplate!: TemplateRef<any>;

  @Input() expanded = false;

  @Input() noHrLine = false;

  @Input() notWithCardStyle: boolean = null;

  @ViewChild('accordion') accordion: FiltersAccordionComponent;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.expanded) this.accordion.matPanel.open();
    });
  }
}

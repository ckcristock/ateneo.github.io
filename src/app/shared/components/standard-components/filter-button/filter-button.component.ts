import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FiltersAccordionComponent } from '../filters-accordion/filters-accordion.component';

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.scss',
})
export class FilterButtonComponent {
  @Input() filtersAccordion!: FiltersAccordionComponent;
  @HostBinding('class') classes = 'btn btn-info btn-sm';
  @HostListener('click', ['event'])
  onClick() {
    this.filtersAccordion.matPanel.toggle();
  }
}

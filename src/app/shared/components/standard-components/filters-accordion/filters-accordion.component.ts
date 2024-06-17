import { Component, ViewChild } from '@angular/core';

import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-filters-accordion',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './filters-accordion.component.html',
  styleUrl: './filters-accordion.component.scss',
})
export class FiltersAccordionComponent {
  @ViewChild('matPanel') matPanel!: MatExpansionPanel;
}

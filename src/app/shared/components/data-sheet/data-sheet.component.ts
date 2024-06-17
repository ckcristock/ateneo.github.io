import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-sheet.component.html',
  styleUrl: './data-sheet.component.scss',
})
export class DataSheetComponent {
  @Input() icon = '';
}

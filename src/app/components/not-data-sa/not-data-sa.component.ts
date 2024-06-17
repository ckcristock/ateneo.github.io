import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-data-sa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-data-sa.component.html',
  styleUrl: './not-data-sa.component.scss',
})
export class NotDataSaComponent {
  @Input('loading') loading: boolean = true;
  @Input('text') text!: string;
  description = '';

  ngOnInit(): void {
    this.description = this.text ? this.text : 'No existen datos para mostrar';
  }
}

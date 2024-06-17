import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemisionService } from '../../../services/remision.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  selector: 'app-credit-notes',
  standalone: true,
  imports: [CommonModule, NotDataComponent, TableComponent],
  templateUrl: './credit-notes.component.html',
  styleUrl: './credit-notes.component.scss',
})
export class CreditNotesComponent implements OnInit {
  @Input() id = 0;

  @Input() invoiceType = '';

  notes = [];

  loading = true;

  constructor(private readonly remisionService: RemisionService) {}

  ngOnInit(): void {
    this.getCreditNotes();
  }

  private getCreditNotes(): void {
    const params = {
      id_factura: this.id,
      tipo_factura: this.invoiceType,
    };
    this.remisionService.getCreditNotes(params).subscribe({
      next: (res) => {
        const { data } = res;
        this.notes = data['Notas'];
        this.loading = false;
      },
    });
  }
}

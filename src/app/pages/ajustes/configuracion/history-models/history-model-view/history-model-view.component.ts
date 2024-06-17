import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryModelPaginate, HistoryModelsService } from '../history-models.service';

@Component({
  selector: 'app-history-model-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-model-view.component.html',
  styleUrl: './history-model-view.component.scss',
})
export class HistoryModelViewComponent implements OnInit {
  @Input() id!: number;

  template!: HistoryModelPaginate;

  constructor(private readonly historyModelService: HistoryModelsService) {}

  ngOnInit(): void {
    this.getTemplate();
  }

  getTemplate() {
    this.historyModelService.getTemplate(this.id).subscribe({
      next: (resp) => {
        this.template = resp.data;
      },
    });
  }
}


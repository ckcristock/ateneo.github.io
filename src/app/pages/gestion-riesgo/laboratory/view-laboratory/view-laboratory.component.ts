import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { LaboratoryService } from '../laboratory.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgClass, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'undefined-view-laboratory',
  templateUrl: './view-laboratory.component.html',
  styleUrls: ['./view-laboratory.component.css'],
  standalone: true,
  imports: [NgIf, NgClass, NgFor, NotDataComponent, DatePipe],
})
export class ViewLaboratoryComponent implements OnInit {
  id: any;
  laboratory: any;
  loading: boolean;
  constructor(
    private _laboratory: LaboratoryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.getLaboratory(this.id);
  }

  getLaboratory(id) {
    this.loading = true;
    this._laboratory.getLaboratory(id).subscribe((res: any) => {
      this.loading = false;
      this.laboratory = res.data;
      console.log(this.laboratory);
    });
  }
}

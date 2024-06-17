import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from 'src/app/core/response.model';
import { ClinicalHistoryService } from '../clinical-history.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-deep-detail',
  templateUrl: './deep-detail.component.html',
  styleUrls: ['./deep-detail.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class DeepDetailComponent implements OnInit {
  public data: any;
  constructor(
    private router: ActivatedRoute,
    private _clinicalHistory: ClinicalHistoryService,
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData = () => {
    this._clinicalHistory
      .getClinicalHistoryDetail({ id: this.router.snapshot.params['id'] })
      .subscribe((data: Response) => {
        console.log(data);

        this.data = data.data;
      });
  };
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from 'src/app/core/response.model';
import { ClinicalHistoryService } from './clinical-history.service';
import { DetailClinicalHistoryComponent } from '../detail-clinical-history/detail-clinical-history.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-clinical-history',
  templateUrl: './clinical-history.component.html',
  styleUrls: ['./clinical-history.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, NgIf, DetailClinicalHistoryComponent],
})
export class ClinicalHistoryComponent implements OnInit {
  public identifier: number;
  histories: Array<Object>;
  loading: boolean = false;
  constructor(
    private _clinicalhistory: ClinicalHistoryService,
    private router: Router,
  ) {}

  ngOnInit() {}

  newClinicalHistory = () => {
    this.router.navigate(['/gestion-riesgo/historia-clinica/nueva-historia-clinica', 12345]);
  };

  getClinicalHistory = () => {
    if (!this.identifier) return false;
    this.loading = true;
    this._clinicalhistory
      .getClinicalHistory({ identifier: this.identifier })
      .subscribe((data: Response) => {
        this.loading = false;
        this.histories = data.data;
      });
  };
}

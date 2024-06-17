import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../job.service';
import { ApplicantComponent } from '../../../../components/applicant/applicant.component';
import { NgIf, UpperCasePipe, DecimalPipe, DatePipe } from '@angular/common';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-vacantes-ver',
  templateUrl: './vacantes-ver.component.html',
  styleUrls: ['./vacantes-ver.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    TableComponent,
    NgIf,
    NotDataComponent,
    ApplicantComponent,
    UpperCasePipe,
    DecimalPipe,
    DatePipe,
  ],
})
export class VacantesVerComponent implements OnInit {
  id = '';
  loading: boolean;
  loadingJob: boolean = false;
  postulados: any = [];
  applicants: any[] = [];
  public job: any;

  constructor(
    private route: ActivatedRoute,
    private _job: JobService,
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getApplicants();
    this.getJob();
  }

  getJob() {
    this.loadingJob = true;
    this._job.getJob(this.id).subscribe((r: any) => {
      this.job = r.data;
      this.loadingJob = false;
    });
  }

  getApplicants() {
    this.loading = true;
    this._job.getApplicants({ job_id: this.id }).subscribe((r: any) => {
      this.applicants = r.data;
      this.loading = false;
    });
  }
}

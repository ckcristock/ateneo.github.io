import { Component, Input, OnInit } from '@angular/core';
import { ActividadesService } from '../../actividades.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { LoadImageComponent } from '../../../../../shared/components/load-image/load-image.component';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

interface Activities {
  id: number;
  description: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  date_end: string;
  date_start: string;
  hour_start: string;
  hour_end: string;
  state: string;
  rrhh_activity_type_id: number;
  dependency_id: number;
  code: string;
  company_id: number;
  activity_type: string;
  group: string;
  start: string;
  dependency_name: string;
  backgroundColor: string;
  title: string;
}

interface People {
  id: number;
  person_id: number;
  person: Person;
}

interface Person {
  id: number;
  text: string;
}

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss'],
  standalone: true,
  imports: [ModalComponent, NgIf, NgFor, LoadImageComponent, NotDataComponent, DatePipe],
})
export class ViewActivityComponent implements OnInit {
  @Input() data!: Activities;

  people: People[] = [];

  loading: boolean = true;

  constructor(private readonly activitiesService: ActividadesService) {}

  ngOnInit(): void {
    this.getPeople();
  }

  private getPeople(): void {
    this.activitiesService.getPeopleActivity(this.data.id).subscribe({
      next: (res) => {
        this.people = res['data'];
        this.loading = false;
      },
    });
  }
}

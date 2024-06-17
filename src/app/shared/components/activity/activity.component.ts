import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadImageComponent } from '../load-image/load-image.component';

export interface Activity {
  title: string;
  full_name: string;
  image: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, LoadImageComponent],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
})
export class ActivityComponent {
  @HostBinding('class') classes = 'card-body';

  @Input() activities: Activity[] = [];

  @Input() titleActivity: string = 'Actividad';
}

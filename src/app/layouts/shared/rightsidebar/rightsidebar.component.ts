import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { UserService } from 'src/app/core/services/user.service';
import { TaskService } from 'src/app/pages/ajustes/informacion-base/services/task.service';
import { NewTaskComponent } from '../../../pages/tasks/new-task/new-task.component';
import { CardTaskComponent } from '../../../pages/tasks/card-task/card-task.component';
import { NgIf, NgFor } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss'],
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CardTaskComponent, NotDataComponent, NewTaskComponent],
})
export class RightsidebarComponent implements OnInit {
  pendientes: any[] = [];
  loading: boolean;
  changes: any;
  constructor(
    public _task: TaskService,
    private _user: UserService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private sideService: SidebarService,
  ) {}

  ngOnInit(): void {
    //this.getPersonTaskPendiente();
  }

  init() {
    document.body.classList.toggle('right-bar-enabled');
    this.getPersonTaskPendiente();
  }

  getPersonTaskPendiente() {
    this.loading = true;
    let params = {
      person_id: this._user.user.person.id,
      estado: 'Pendiente',
    };
    this._task.personTasks(params).subscribe((d: any) => {
      this.loading = false;
      this.pendientes = d.data;
      for (let i in d.data) {
        this.pendientes[i].descripcion = this.sanitizer.bypassSecurityTrustHtml(
          atob(this.pendientes[i].descripcion),
        );
      }
    });
  }

  route(id) {
    this.router.navigate(['task', id]);
  }

  public hide() {
    this.sideService.onTaskButtonClicked();
  }
}

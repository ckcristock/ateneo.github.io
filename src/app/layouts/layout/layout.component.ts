import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { GlobalService } from '@shared/services/global.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/services/person/person.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { RestorePasswordComponent } from '../../components/restore-password/restore-password.component';
import { HorizontalnavbarComponent } from '../shared/horizontalnavbar/horizontalnavbar.component';
import { HorizontaltopbarComponent } from '../shared/horizontaltopbar/horizontaltopbar.component';
import { RightsidebarComponent } from '../shared/rightsidebar/rightsidebar.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    MatSidenavModule,
    NgIf,
    RightsidebarComponent,
    HorizontaltopbarComponent,
    HorizontalnavbarComponent,
    RestorePasswordComponent,
    RouterOutlet,
    FooterComponent,
  ],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer: MatDrawer;
  constructor(
    private readonly sideBar: SidebarService,
    private readonly personService: PersonService,
    private readonly globalService: GlobalService,
  ) {}
  ngAfterViewInit(): void {
    this.sideBar.sideBar = this.drawer;
  }

  ngOnInit() {
    document.body.setAttribute('data-layout', 'horizontal');
    document.body.removeAttribute('data-sidebar');
    document.body.setAttribute('data-topbar', 'light');
    this.getPeople();
  }

  private getPeople(): void {
    this.personService.getPersonCompany().subscribe({
      next: (res) => {
        this.globalService.people$.next(res['data']);
      },
    });
  }
}

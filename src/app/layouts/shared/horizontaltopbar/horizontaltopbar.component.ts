import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { User } from 'src/app/core/models/users.model';
import { interval, Subscription } from 'rxjs';
import { AlertasComunService } from 'src/app/pages/rrhh/alertas-comun/alertas-comun.service';
import { map } from 'rxjs/operators';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { UserService } from '@app/core/services/user.service';
import { ImagePipe } from '@app/core/pipes/image.pipe';
import { EMPRESA } from '@app/core/utils/consts';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';

@Component({
  selector: 'app-horizontaltopbar',
  templateUrl: './horizontaltopbar.component.html',
  styleUrls: ['./horizontaltopbar.component.scss'],
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    RouterLink,
    NgbDropdownMenu,
    NotDataComponent,
    TitleCasePipe,
    ImagePipe,
    LoadImageComponent,
  ],
})
export class HorizontaltopbarComponent implements OnInit {
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  alerts$!: Subscription;

  alerts: any[] = [];

  company = EMPRESA;

  logo =
    this.company === 'ATENEO'
      ? 'assets/images/logo-dark.svg'
      : this.company === 'EMCO'
        ? 'assets/images/logo-dark-emco.svg'
        : 'assets/images/logo-dark-somos.svg';

  logoSM =
    this.company === 'ATENEO'
      ? 'assets/images/logo-sm-dark.svg'
      : this.company === 'EMCO'
        ? 'assets/images/logo-sm-dark-emco.svg'
        : 'assets/images/logo-sm-dark-somos.svg';

  allAlerts: any[] = [];

  count: any = 0;

  loading!: boolean;

  viewFolder!: boolean;

  folder_permission: any;

  public user!: User;

  window = window;
  constructor(
    @Inject(DOCUMENT) private document: any,
    private _user: UserService,
    public http: HttpClient,
    private _alert: AlertasComunService,
    private _swal: SwalService,
    private sideService: SidebarService,
  ) {}

  ngOnInit(): void {
    this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));

    this.user = this._user.user;

    this.folder_permission = this._user.user.person.folder_id;

    this.validateFolder(this.folder_permission);

    this.getAlerts();
  }

  getAlerts() {
    this.loading = true;
    if (this.user.person.id) {
      let param = { user_id: this.user.person.id };
      this._alert.getAlertsNotification(param).subscribe((r: any) => {
        this.alerts = r.data.slice(0, 10);
        this.allAlerts = r.data;
        interval(60000)
          .pipe(
            map(() => {
              this.refreshTime();
            }),
          )
          .subscribe();
        if (r.code <= 99) {
          this.count = r.code;
        } else {
          this.count = '99+';
        }
        this.loading = false;
      });
    }
  }

  onScroll(event: Event): void {
    const container = event.target as HTMLElement;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      this.loadMoreItems();
    }
  }

  loadMoreItems(): void {
    const startIndex = this.alerts.length;
    const endIndex = startIndex + 10;
    this.alerts = this.alerts.concat(this.allAlerts.slice(startIndex, endIndex));
  }

  refreshTime() {
    this.alerts.forEach((element) => {
      element.time_ago = this.getTimeAgo(element.created_at);
    });
  }

  getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const targetTime = new Date(timestamp).getTime();
    const difference = now - targetTime;
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      if (days === 1) {
        return 'hace 1 día';
      } else {
        return `hace ${days} días`;
      }
    } else if (hours > 0) {
      if (hours === 1) {
        return 'hace 1 hora';
      } else {
        return `hace ${hours} horas`;
      }
    } else if (minutes > 0) {
      if (minutes === 1) {
        return 'hace 1 minuto';
      } else {
        return `hace ${minutes} minutos`;
      }
    } else {
      return 'hace un momento';
    }
  }

  markAllAsRead() {
    const request = () => {
      this._alert.markAllAsRead().subscribe({
        next: () => {
          this.getAlerts();
          this._swal.success('Notificaciones marcadas como leidas');
        },
      });
    };
    this._swal.swalLoading(
      '¿Estás seguro(a) de marcar todas las notificaciones como leidas?',
      request,
    );
  }

  validateFolder(folderId: number) {
    this.viewFolder = folderId !== 0;
  }

  toggleMenubar() {
    const element = document.getElementById('topnav-menu-content');
    element?.classList.toggle('show');
  }

  onSettingsButtonClicked() {
    this.sideService.onTaskButtonClicked();
  }

  logout() {
    this._user.logout();
  }

  read(not: any) {
    if (not.read_boolean == 0) {
      let params = {
        id: not.id,
        user_id: this.user.person.id,
      };
      this._alert.read(params).subscribe((res: any) => {
        this.alerts = res.data;
        if (res.code <= 99) {
          this.count = res.code;
        } else {
          this.count = '99+';
        }
      });
    }
  }

  changeCompany(companyId: any) {
    this._user.changeCompany(companyId).subscribe({
      next: () => {
        window.location.reload();
      },
    });
  }
}

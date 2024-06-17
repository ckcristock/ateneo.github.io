import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { EMPRESA } from './core/utils/consts';
import { DOCUMENT } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
})
export class AppComponent implements OnInit {
  company = EMPRESA;

  favico =
    EMPRESA == 'ATENEO' ? 'favicon.ico' : EMPRESA == 'EMCO' ? 'faviconemco.ico' : 'faviconemco.ico';

  $renewingToken: boolean = false;

  constructor(
    private title: Title,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.title.setTitle(`${this.company} ERP - SOFTWARE DE GESTIÓN MEDICO-ASISTENCIAL`);
    document.head.getElementsByClassName('favicon').item(0).setAttribute('href', this.favico);
  }
  ngOnInit(): void {
    this.userService.renewingToken$.subscribe((renewing) => {
      this.$renewingToken = renewing;
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPRESA } from '@app/core/utils/consts';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  company = EMPRESA;

  urlImage =
    this.company === 'ATENEO'
      ? 'assets/images/logo-dark.svg'
      : this.company === 'EMCO'
        ? 'assets/images/logo-dark-emco.svg'
        : 'assets/images/logo-dark-somos.svg';

  constructor() {}
}

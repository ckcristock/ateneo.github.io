import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { typeHeaderButton } from '@shared/interfaces/global.interface';

@Component({
  selector: 'app-header-button',
  standalone: true,
  imports: [],
  templateUrl: './header-button.component.html',
  styleUrl: './header-button.component.scss',
})
export class HeaderButtonComponent implements OnInit {
  @Input() type: typeHeaderButton = 'info';

  @Input() icon = '';

  @Input() text = '';

  @HostBinding('class') classes = '';

  @HostBinding('role') role = 'button';

  ngOnInit(): void {
    this.classes = `btn btn-${this.type} btn-sm`;
  }
}

import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { typeHeaderButton } from '@shared/interfaces/global.interface';

@Component({
  selector: 'app-header-download',
  standalone: true,
  imports: [],
  templateUrl: './header-download.component.html',
  styleUrl: './header-download.component.scss',
})
export class HeaderDownloadComponent implements OnInit {
  @Input() type: typeHeaderButton = 'success';

  @Input() icon = 'file-download';

  @Input() text = 'Descargar';

  @Input('downloading') set changeDownloading(newDownloading: boolean) {
    this.downloading = newDownloading
    if (newDownloading) this.classes += ' disabled'
    else this.classes = this.classes.replace(' disabled', '')
  }

  @HostBinding('class') classes = '';

  @HostBinding('role') role = 'button';

  downloading = false

  ngOnInit(): void {
    this.classes = `btn btn-${this.type} btn-sm`;
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf, NgOptimizedImage, NgStyle } from '@angular/common';

@Component({
  selector: 'app-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgOptimizedImage, NgStyle],
})
export class LoadImageComponent {
  @Input() srcDefault = './assets/images/noprofile.png';

  @Input() classImg = '';

  @Input() src = '';

  @Input() alt = 'Image server';

  @Input() stylesImg: Record<string, string> = {};

  @Input() width = '200';

  @Input() height = '200';

  isLoadImage = false;

  loadImage(): void {
    this.isLoadImage = true;
  }
}

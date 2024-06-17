import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgClass, NgStyle, NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-basic',
  templateUrl: './modal-basic.component.html',
  styleUrls: ['./modal-basic.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgClass, NgStyle, NgIf],
})
export class ModalBasicComponent implements OnInit {
  @Input()
  dialogClass!: string;
  @Input() hideHeader = false;
  @Input() hideFooter = false;
  public visible = false;
  public visibleAnimate = false;

  constructor() {}

  ngOnInit() {}

  public show(): void {
    this.visible = true;
    setTimeout(() => (this.visibleAnimate = true), 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => (this.visible = false), 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
    }
  }
}

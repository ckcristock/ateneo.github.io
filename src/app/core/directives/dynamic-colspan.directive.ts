import { Directive, ElementRef, Input, Renderer2, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[DynamicColspan]',
  standalone: true,
})
export class DynamicColspanDirective {
  valor!: number;
  @Input() DynamicColspan: any;
  @Input() min = 1;
  @Input() max!: number;

  @HostListener('click') onclik() {
    this.valor = this.valor == this.min ? this.max : this.min;
    this.renderer.setAttribute(this.el.nativeElement, 'colspan', this.valor.toString());
  }

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.valor = this.min;
    this.renderer.setAttribute(this.el.nativeElement, 'colspan', this.valor.toString());
  }
}

import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private element: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    this.element.nativeElement.focus();
  }
}

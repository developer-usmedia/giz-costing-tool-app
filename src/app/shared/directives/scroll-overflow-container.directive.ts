import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[gizScrollOverflowContainer]' })
export class ScrollOverflowContainerDirective {
    constructor(
        public elementRef: ElementRef<HTMLElement>,
    ) { }
}

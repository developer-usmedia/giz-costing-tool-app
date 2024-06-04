import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[gizScrollOverflowContainer]',
    standalone: true,
})
export class ScrollOverflowContainerDirective {
    constructor(
        public elementRef: ElementRef<HTMLElement>,
    ) { }
}

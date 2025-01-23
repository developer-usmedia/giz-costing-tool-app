import {
    AfterViewInit,
    ChangeDetectorRef,
    ContentChildren,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    QueryList,
} from '@angular/core';
import { ScrollOverflowContainerDirective } from '@shared/directives/scroll-overflow-container.directive';

@Directive({ selector: '[gizScrollOverflow]' })
export class ScrollOverflowDirective implements AfterViewInit {
    @ContentChildren(ScrollOverflowContainerDirective, { descendants: true }) scrollContainer!: QueryList<ScrollOverflowContainerDirective>;

    public overflowing = false;
    public overflowRight = false;
    public overflowLeft = false;

    private scrollDistance = 0;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
    ) {
    }

    @HostBinding('class.is-overflowing') get modOverflowing(): boolean {
        return this.overflowing;
    }

    @HostBinding('class.is-overflow-right') get modOverflowRight(): boolean {
        return this.overflowRight;
    }

    @HostBinding('class.is-overflow-left') get modOverflowLeft(): boolean {
        return this.overflowLeft;
    }

    @HostListener('window:resize', [ '$event' ])
    onResize(): void {
        this.checkOverflow();
    }

    public ngAfterViewInit(): void {
        requestAnimationFrame(() => {
            this.checkOverflow();
            if (this.scrollContainer.length > 0) {
                this.scrollContainer.first.elementRef.nativeElement.addEventListener('scroll', () => {
                    this.checkOverflow();
                });
            }
        });
    }

    public checkOverflow(): void {
        if (!this.scrollContainer.length) {
            return;
        }

        const nativeElem = this.elementRef.nativeElement;
        const containerNativeElem = this.scrollContainer.first.elementRef.nativeElement;
        this.scrollDistance = this.scrollContainer.first.elementRef.nativeElement.scrollLeft;
        const elemWidth = nativeElem.offsetWidth +
            parseFloat(window.getComputedStyle(nativeElem).marginLeft) +
            parseFloat(window.getComputedStyle(nativeElem).marginRight);
        const containerWidth = containerNativeElem.scrollWidth + parseFloat(window.getComputedStyle(nativeElem).marginRight);

        this.overflowing = containerWidth > elemWidth;
        this.checkLeftRightOverflow();
        this.changeDetectorRef.markForCheck();
    }

    public checkLeftRightOverflow(): void {
        const maxScroll = this.scrollContainer.first.elementRef.nativeElement.scrollWidth - this.elementRef.nativeElement.scrollWidth;

        if (!this.overflowing) {
            this.overflowLeft = false;
            this.overflowRight = false;
        } else {
            this.overflowLeft = this.scrollDistance !== 0;
            this.overflowRight = this.scrollDistance + 1 < maxScroll; // +1 because of chrome round bug
        }

        this.changeDetectorRef.markForCheck();
    }
}

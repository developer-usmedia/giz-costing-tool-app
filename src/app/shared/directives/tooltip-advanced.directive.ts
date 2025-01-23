import { Overlay, OverlayConfig, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    EmbeddedViewRef,
    HostListener,
    inject,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';

import { TooltipAdvancedComponent } from '@shared/components/tooltip-advanced/tooltip-advanced.component';

@Directive({ selector: '[gizTooltipAdvanced]' })
export class TooltipAdvancedDirective implements OnInit, OnDestroy {
    @Input({ required: true }) template!: TemplateRef<TooltipAdvancedComponent>;

    private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
    private readonly elementRef = inject(ElementRef);
    private readonly overlay = inject(Overlay);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly viewContainerRef = inject(ViewContainerRef);

    private tooltipRef?: EmbeddedViewRef<TooltipAdvancedComponent>;
    private overlayRef?: OverlayRef;
    private isOpen = false;
    private isClicked = false;

    @HostListener('click')
    show() {
        if (this.isOpen && this.isClicked) {
            this.close();
        } else {
            this.isClicked = true;
            this.open();
        }
    }

    @HostListener('mouseover')
    mouseover() {
        this.open();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e: Event) {
        const target = e.target as HTMLElement;
        if (this.isOpen && !(this.elementRef.nativeElement as HTMLElement).contains(target) &&
            !(this.overlayRef && this.overlayRef.overlayElement?.contains(target))) {
            this.close();
        }
    }

    public ngOnInit() {
        this.createOverlayRef();
    }

    public ngOnDestroy() {
        this.overlayRef?.dispose();
    }

    private open() {
        if (!this.overlayRef || this.isOpen) {
            return;
        }

        this.isOpen = true;
        this.tooltipRef = this.overlayRef.attach(
            new TemplatePortal(this.template, this.viewContainerRef)
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const childNodes: NodeList = this.tooltipRef.rootNodes[0].childNodes;
        if (childNodes) {
            for (const node of childNodes) {
                if ((node as HTMLElement).classList.contains('tooltip-advanced__close')) {
                    node.addEventListener('click', () => {
                        this.close();
                    });
                }
            }
        }
    }

    private close() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.isOpen = false;
            this.isClicked = false;
            this.tooltipRef = undefined;
            this.changeDetectorRef.markForCheck();
        }
    }

    private createOverlayRef(): void {
        const positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.elementRef)
            .withPositions([
                // top left
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'end',
                    overlayY: 'top',
                },
                // top right
                {
                    originX: 'end',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'top',
                },
                // bottom center
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                },
            ]);

        const overlayConfig = new OverlayConfig({
            scrollStrategy: this.overlay.scrollStrategies.close(),
            positionStrategy: positionStrategy,
        });

        this.overlayRef = this.overlay.create(overlayConfig);
    }
}

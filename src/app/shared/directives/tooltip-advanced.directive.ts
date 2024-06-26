import { Overlay, OverlayConfig, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    ChangeDetectorRef,
    ComponentRef,
    Directive,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TooltipAdvancedComponent } from '@shared/components/tooltip-advanced/tooltip-advanced.component';

@Directive({
    selector: '[gizTooltipAdvanced]',
    standalone: true,
})
export class TooltipAdvancedDirective implements OnInit, OnDestroy {
    @Input({ required: true }) text!: string;
    @Input() button?: { label: string; link: string | any[] };

    private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
    private readonly elementRef = inject(ElementRef);
    private readonly overlay = inject(Overlay);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    private tooltipRef?: ComponentRef<TooltipAdvancedComponent>;
    private overlayRef?: OverlayRef;
    private isOpen = false;
    private isClicked = false;
    private subscription?: Subscription;

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

    @HostListener('mouseleave')
    mouseout() {
        if (!this.isClicked) {
            // TODO: Only close when mouse also no in opened tooltip
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
            new ComponentPortal(TooltipAdvancedComponent)
        );
        this.tooltipRef.instance.text = this.text;
        this.tooltipRef.instance.button = this.button;
        this.subscription = this.tooltipRef.instance.closeTooltip.subscribe(() => {
            this.close();
        });
    }

    private close() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.isOpen = false;
            this.isClicked = false;
            this.tooltipRef = undefined;
            this.changeDetectorRef.markForCheck();
            this.subscription?.unsubscribe();
        }
    }

    private createOverlayRef(): void {
        const positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.elementRef)
            .withPositions([
                // top right
                {
                    originX: 'end',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'top',
                },
                // top left
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'end',
                    overlayY: 'top',
                },
                // bottom center
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                    offsetY: 4,
                },
            ]);

        const overlayConfig = new OverlayConfig({
            scrollStrategy: this.overlay.scrollStrategies.close(),
            positionStrategy: positionStrategy,
        });

        this.overlayRef = this.overlay.create(overlayConfig);
    }
}


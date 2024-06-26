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
import { TooltipComponent } from '@shared/components/tooltip/tooltip.component';

@Directive({
    selector: '[gizTooltip]',
    standalone: true,
})
export class TooltipDirective implements OnInit, OnDestroy {
    @Input({ required: true }) text!: string;

    private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
    private readonly elementRef = inject(ElementRef);
    private readonly overlay = inject(Overlay);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    private overlayRef?: OverlayRef;
    private isOpen = false;

    @HostListener('mouseover')
    mouseover() {
        this.open();
    }

    @HostListener('mouseleave')
    mouseout() {
        this.close();
    }

    public ngOnInit() {
        this.createOverlayRef();
    }

    public ngOnDestroy() {
        this.close();
    }

    private open() {
        if (!this.overlayRef || this.isOpen) {
            return;
        }

        this.isOpen = true;
        const tooltipRef: ComponentRef<TooltipComponent> = this.overlayRef.attach(
            new ComponentPortal(TooltipComponent)
        );
        tooltipRef.instance.text = this.text;
    }

    private close() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.isOpen = false;
            this.changeDetectorRef.markForCheck();
        }
    }

    private createOverlayRef(): void {
        const positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.elementRef)
            .withPositions([{
                originX: 'center',
                originY: 'bottom',
                overlayX: 'center',
                overlayY: 'top',
                offsetY: 4,
            }]);

        const overlayConfig = new OverlayConfig({
            scrollStrategy: this.overlay.scrollStrategies.close(),
            positionStrategy: positionStrategy,
        });

        this.overlayRef = this.overlay.create(overlayConfig);
    }
}


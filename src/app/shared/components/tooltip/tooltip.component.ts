import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'giz-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TooltipComponent {
    @Input({ required: true }) text!: string;
    @HostBinding('class') cssClass = 'tooltip';
}

import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'giz-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ProgressBarComponent {
    @HostBinding('class') cssClass = 'progress-bar';

    @Input({ required: true })
    @HostBinding('attr.data-progress') progress = 0;
}

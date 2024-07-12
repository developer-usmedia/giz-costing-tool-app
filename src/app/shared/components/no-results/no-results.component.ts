import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'giz-no-results',
    templateUrl: './no-results.component.html',
    styleUrl: './no-results.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class NoResultsComponent {
    @HostBinding('class') cssClass = 'no-results';
}

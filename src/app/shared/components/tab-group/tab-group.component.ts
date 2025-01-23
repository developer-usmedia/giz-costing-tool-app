import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ScrollOverflowDirective } from '../../directives/scroll-overflow.directive';
import { ScrollOverflowContainerDirective } from '../../directives/scroll-overflow-container.directive';

@Component({
    selector: 'giz-tab-group',
    templateUrl: './tab-group.component.html',
    styleUrls: [ './tab-group.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [ScrollOverflowDirective, ScrollOverflowContainerDirective],
})
export class TabGroupComponent {
}

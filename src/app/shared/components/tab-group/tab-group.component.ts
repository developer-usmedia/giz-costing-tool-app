import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'giz-tab-group',
    templateUrl: './tab-group.component.html',
    styleUrls: [ './tab-group.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TabGroupComponent {
}

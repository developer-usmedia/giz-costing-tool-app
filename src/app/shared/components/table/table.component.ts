import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ScrollOverflowDirective } from '../../directives/scroll-overflow.directive';
import { NgClass } from '@angular/common';
import { ScrollOverflowContainerDirective } from '../../directives/scroll-overflow-container.directive';

@Component({
    selector: 'giz-table',
    templateUrl: './table.component.html',
    styleUrls: [ './table.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ScrollOverflowDirective,
        NgClass,
        ScrollOverflowContainerDirective,
    ],
})
export class TableComponent {
    @Input() loading = false;
    @Input() caption = 'table';
    @Input() captionSize: 'default' | 'small' = 'default';
    @Input() type: 'default' | 'compact' | 'info' | 'overview' | 'report' = 'default';
    @Input() hideCaption = false;
    @Input() noBorder = false;
    @Input() stickyColumn = false;
}

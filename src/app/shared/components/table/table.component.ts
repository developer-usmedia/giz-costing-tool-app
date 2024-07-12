import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'giz-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
    @Input() loading = false;
    @Input() caption = 'table';
    @Input() type: 'default' | 'compact' | 'info' | 'overview' = 'default';
    @Input() hideCaption = false;
    @Input() noBorder = false;
    @Input() stickyColumn = false;
}

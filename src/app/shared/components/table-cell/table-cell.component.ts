import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input, OnChanges,
    Output, SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { Sort } from '@core/models/paging.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'td[giz-table-cell], th[giz-table-header-cell]',
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('rotateArrow', [
            state('down', style({ transform: 'rotate(0)' })),
            state('up', style({ transform: 'rotate(180deg)' })),
            transition('down <=> up', animate('.2s ease-in')),
        ]),
        trigger('fadeArrow', [
            state('inactive', style({ opacity: '0.2' })),
            state('active', style({ opacity: '1' })),
            transition('inactive <=> active', animate('.2s ease-in')),
        ]),
    ],
})
export class TableCellComponent implements OnChanges {
    @Input() alignment: 'left' | 'right' | 'center' = 'left';
    @Input() type: 'default' | 'header' | 'actions' | 'link' | 'copy' = 'default';
    @Input() size: 'default' | 'wide' = 'default';
    @Input() sortable = false;
    @Input() sort?: Sort;

    @Output() sortEvent = new EventEmitter<Sort>();

    @HostBinding('class') cssClass = 'table-cell';

    public arrowDirection: 'up' | 'down' = 'down';
    public arrowState: 'active' | 'inactive' = 'inactive';

    protected readonly icon = ICON;

    constructor(
        private readonly elementRef: ElementRef,
    ) {
        this.determineCellType();
    }

    @HostBinding('class.table-cell--header') get modHeader(): boolean { return this.type === 'header'; }
    @HostBinding('class.table-cell--actions') get modActions(): boolean { return this.type === 'actions'; }
    @HostBinding('class.table-cell--link') get modLink(): boolean { return this.type === 'link'; }
    @HostBinding('class.table-cell--copy') get modCopy(): boolean { return this.type === 'copy'; }
    @HostBinding('class.table-cell--sort') get modSort(): boolean { return this.sortable; }
    @HostBinding('class.table-cell--wide') get modeSizeWide(): boolean { return this.size === 'wide'; }
    @HostBinding('class.table-cell--center') get modeAlignmentCenter(): boolean { return this.alignment === 'center'; }
    @HostBinding('class.table-cell--right') get modeAlignmentRight(): boolean { return this.alignment === 'right'; }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['sort']) {
            this.arrowDirection = this.sort === Sort.DESC ? 'down' : 'up';
            this.arrowState = this.sort === null ? 'inactive' : 'active';
        }

        if (changes['sortable'] && !this.sortable) {
            this.sort = undefined;
            this.arrowState = 'inactive';
            this.arrowDirection = 'down';
        }
    }

    public onSort(): void {
        if (this.sort === Sort.ASC) {
            this.sort = Sort.DESC;
            this.arrowState = 'active';
            this.arrowDirection = 'down';
        } else {
            this.sort = Sort.ASC;
            this.arrowState = 'active';
            this.arrowDirection = 'up';
        }
        this.sortEvent.emit(this.sort);
    }

    private determineCellType(): void {
        const host = this.elementRef.nativeElement as HTMLElement;

        if (host.hasAttribute('giz-table-header-cell')) {
            this.type = 'header';
        }
    }
}

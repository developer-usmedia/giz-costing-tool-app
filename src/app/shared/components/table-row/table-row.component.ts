import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'tr[giz-table-row], tr[giz-table-header-row]',
    templateUrl: './table-row.component.html',
    styleUrls: [ './table-row.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowComponent{
    @Input() type: 'default' | 'header' = 'default';
    @Input() isClickable = false;
    @Input() editted = false;

    @HostBinding('class') cssClass = 'table-row';

    constructor(
        private readonly elementRef: ElementRef,
    ) {
        this.determineRowType();
    }

    @HostBinding('class.table-row--header') get modHeader(): boolean { return this.type === 'header'; }
    @HostBinding('class.table-row--clickable') get modClickable(): boolean { return this.isClickable; }
    @HostBinding('class.table-row--editted') get modEditted(): boolean { return this.editted; }

    private determineRowType(): void {
        const host = this.elementRef.nativeElement as HTMLElement;

        if (host.hasAttribute('giz-header-row')) {
            this.type = 'header';
        }
    }
}

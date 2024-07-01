import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding, inject,
    Input,
    OnChanges,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { FormControl } from '@angular/forms';
import { ICON } from '@shared/components/icon/icon.enum';
import { PageEvent } from '@shared/components/paginator/paginator.model';
@Component({
    selector: 'giz-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: [ './paginator.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements OnChanges {
    @Input() disabled = false;
    @Input() showFirstLast = true;

    @Output() readonly paging = new EventEmitter<PageEvent>();

    @HostBinding('class') class = 'paginator';

    public inputPage = new FormControl<number | null>(null);
    public inputPageSize = new FormControl<number | null>(null);

    protected readonly icon = ICON;

    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private _page = 0;
    private _pageSize = 25;
    private _total = 0;
    private _totalEntries = 0;

    /* eslint-disable @typescript-eslint/member-ordering */
    @Input()
    get page(): number { return this._page; }
    set page(value: number) { this._page = Math.max(coerceNumberProperty(value), 0); }

    @Input()
    get pageSize(): number { return this._pageSize; }
    set pageSize(value: number) { this._pageSize = Math.max(coerceNumberProperty(value), 0); }

    @Input()
    get total(): number { return this._total; }
    set total(value: number) { this._total = Math.ceil(coerceNumberProperty(value)); }

    @Input()
    get totalEntries(): number { return this._totalEntries; }
    set totalEntries(value: number) { this._totalEntries = Math.ceil(coerceNumberProperty(value)); }

    /** Checks whether the select for page selection should be disabled. */
    public get inputPageDisabled(): boolean {
        return this.disabled || this.total < 2;
    }

    /** Checks whether the button for going forwards should be disabled. */
    public get nextButtonDisabled(): boolean {
        return this.disabled || !this.hasNextPage();
    }

    /** Checks whether the button for going backwards should be disabled. */
    public get prevButtonDisabled(): boolean {
        return this.disabled || !this.hasPrevPage();
    }

    get entriesForPage(): string {
        const start = (this.page - 1 ) * this.pageSize + 1;
        const end = Math.min(start + this.pageSize - 1, this.totalEntries);
        return `${ start } - ${ end } ${ $localize`:paginator page-of:of` } ${ this.totalEntries }`;

    }
    /* eslint-enable @typescript-eslint/member-ordering */

    public ngOnChanges(): void {
        this.inputPage.setValue(this._page);
        this.inputPageSize.setValue(this._pageSize);

        if (this.inputPageDisabled) {
            this.inputPage.disable();
        }
        else {
            this.inputPage.enable();
        }
    }

    /** Advances to the next page if it exists. */
    public goToPage(): void {
        const page: number = this.inputPage.value as number;
        if (page === this._page || page > this.total || page <= 0) {
            this.inputPage.setValue(this._page);
            return;
        }

        const previous = this._page;
        this._page = page;
        this.emitPageEvent(previous);
    }

    /** Advances to the next page if it exists. */
    public nextPage(): void {
        if (!this.hasNextPage()) { return; }

        const previous = this._page;
        this._page++;
        this.emitPageEvent(previous);
    }

    /** Move back to the previous page if it exists. */
    public prevPage(): void {
        if (!this.hasPrevPage()) { return; }

        const previous = this._page;
        this._page--;
        this.emitPageEvent(previous);
    }

    /** Move to the first page if not already there. */
    public firstPage(): void {
        // hasPrevPage being false implies at the start
        if (!this.hasPrevPage()) { return; }

        const previous = this._page;
        this._page = 1;
        this.emitPageEvent(previous);
    }

    /** Move to the last page if not already there. */
    public lastPage(): void {
        // hasNextPage being false implies at the end
        if (!this.hasNextPage()) { return; }

        const previous = this._page;
        this._page = this.total;
        this.emitPageEvent(previous);
    }

    /** Updates page size */
    public updateSize(): void {
        const size: number = this.inputPageSize.value ?? 25;
        const previous = this._page;
        this._page = 1;
        this._pageSize = size;
        this.emitPageEvent(previous);
    }

    /** Whether there is a previous page. */
    public hasPrevPage(): boolean {
        return this._page > 1 && this._pageSize !== 0;
    }

    /** Whether there is a next page. */
    public hasNextPage(): boolean {
        return this._page < this.total && this._pageSize !== 0;
    }

    /** Emits an event notifying that a change of the paginator's properties has been triggered. */
    private emitPageEvent(previousPage: number) {
        this.changeDetectorRef.markForCheck();

        this.paging.emit({
            previousPage: previousPage,
            previousSize: previousPage,
            page: this._page,
            pageSize: this._pageSize,
            total: this._total,
        });
    }
}

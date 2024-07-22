import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

import { Entry } from '@api/models';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-entry-card',
    templateUrl: './entry-card.component.html',
    styleUrl: './entry-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class EntryCardComponent {
    @Input({ required: true }) entry!: Entry;
    @Input() link?: string | any[];
    @Input() isMain = false;
    @Input() showStatus = true;

    @HostBinding('class') cssClass = 'entry-card';

    protected readonly icon = ICON;

    @HostBinding('class.entry-card--link') get modLink(): boolean {
        return !!this.link;
    }

    @HostBinding('class.entry-card--main') get modMain(): boolean {
        return this.isMain;
    }

    get tooltipImport(): string {
        return $localize`:entry import:Imported from Salary Matrix`;
    }

    get tooltipVerified(): string {
        return $localize`:entry verified:Verified in Salary Matrix`;
    }
}

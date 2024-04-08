import { ChangeDetectionStrategy, Component, Inject, Input, LOCALE_ID, ViewEncapsulation } from '@angular/core';

import { ICON } from '@shared/components/icon/icon.enum';
import { LOCALE, ROOT_ROUTE } from '@core/models';

@Component({
    selector: 'giz-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {
    @Input() theme: 'default' | 'white' = 'default';

    protected readonly icon = ICON;
    protected readonly rootRoute = ROOT_ROUTE;

    constructor(
        @Inject(LOCALE_ID) public locale: string
    ) {}

    get currentLanguage(): string {
        switch (this.locale) {
            case LOCALE.ES:
                return $localize`:language espagnol:Espagnol`;
            default:
                return $localize`:language english:English`;
        }
    }
}

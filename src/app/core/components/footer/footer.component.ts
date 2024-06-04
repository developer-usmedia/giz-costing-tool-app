import { ChangeDetectionStrategy, Component, Inject, Input, LOCALE_ID, ViewEncapsulation } from '@angular/core';

import { ICON } from '@shared/components/icon/icon.enum';
import { LOCALE, LOCALES, ROOT_ROUTE } from '@core/models';

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
    protected readonly routes = ROOT_ROUTE;
    protected readonly locales = LOCALES;

    constructor(
        @Inject(LOCALE_ID) public currentLocale: string,
    ) {}

    public languageLabel(locale: string): string {
        switch (locale) {
            case LOCALE.ES:
                return $localize`:language espagnol:Español`;
            default:
                return $localize`:language english:English`;
        }
    }

    public getTranslatedRoute(locale: string) {
        if (locale === this.currentLocale) {
            return window.location.pathname;
        }

        return window.location.pathname.replace(`/${ this.currentLocale }/`, `/${ locale }/`);
    }
}

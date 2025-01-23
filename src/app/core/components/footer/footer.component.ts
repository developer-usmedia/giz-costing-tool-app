import { ChangeDetectionStrategy, Component, Inject, Input, LOCALE_ID, ViewEncapsulation } from '@angular/core';

import { LOCALE, LOCALES, ROOT_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { MenuComponent } from '@shared/components/menu/menu.component';
import { MenuItemComponent } from '@shared/components/menu-item/menu-item.component';

@Component({
    selector: 'giz-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgClass,
        RouterLink,
        ButtonComponent,
        CdkMenuTrigger,
        CdkMenu,
        MenuComponent,
        CdkMenuItem,
        MenuItemComponent,
    ],
})
export class FooterComponent {
    @Input() theme: 'default' | 'white' = 'default';

    protected readonly icon = ICON;
    protected readonly routes = ROOT_ROUTE;
    protected readonly locales = LOCALES;

    constructor(
        @Inject(LOCALE_ID) public currentLocale: string,
    ) {}

    get year(): number {
        return new Date().getFullYear();
    }

    public languageLabel(locale: string): string {
        switch (locale as LOCALE) {
            case LOCALE.ES:
                return 'Español';
            default:
                return 'English';
        }
    }

    public getTranslatedRoute(locale: string) {
        if (locale === this.currentLocale) {
            return window.location.pathname;
        }

        return window.location.pathname.replace(`/${ this.currentLocale }/`, `/${ locale }/`);
    }
}

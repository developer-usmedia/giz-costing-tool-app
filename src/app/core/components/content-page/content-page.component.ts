import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { getBreadCrumbTitle } from '@shared/helpers';
import { BreadcrumbItem, ROOT_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { AuthService } from '@core/services';
import { APP_BASE_HREF } from '@angular/common';

@Component({
    selector: 'giz-content-page',
    templateUrl: './content-page.component.html',
    styleUrl: './content-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent {
    @Input() size: 'wide' | 'default' = 'default';
    @Input() showBackground = false;

    public loggedIn = this.authService.isLoggedIn();

    public breadcrumb: BreadcrumbItem[] = this.loggedIn ? [
        {
            name: getBreadCrumbTitle(ROOT_ROUTE.DASHBOARD),
            link: ROOT_ROUTE.DASHBOARD,
            icon: ICON.DASHBOARD,
            active: true,
        },
    ] : [
        {
            name: getBreadCrumbTitle(ROOT_ROUTE.HOME),
            link: ROOT_ROUTE.HOME,
            icon: ICON.HOME,
            active: true,
        },
    ];

    constructor(
        @Inject(APP_BASE_HREF) public baseHref: string,
        private readonly authService: AuthService,
    ) {
    }
}

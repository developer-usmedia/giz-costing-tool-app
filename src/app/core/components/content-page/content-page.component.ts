import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getBreadCrumbTitle } from '@shared/helpers';
import { BreadcrumbItem, ROOT_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-content-page',
    templateUrl: './content-page.component.html',
    styleUrl: './content-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent {
    public breadcrumb: BreadcrumbItem[] =[
        {
            name: getBreadCrumbTitle(ROOT_ROUTE.HOME),
            link: ROOT_ROUTE.HOME,
            icon: ICON.HOME,
            active: true,
        },
    ];
}

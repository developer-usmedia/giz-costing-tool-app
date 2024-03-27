import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { User } from '@api/models';
import { AUTH_ROUTE, BreadcrumbItem, ROOT_ROUTE } from '@core/models';
import { ConnectedPosition } from '@angular/cdk/overlay';

@Component({
    selector: 'giz-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    @Input({ required: true }) breadcrumb!: BreadcrumbItem[];
    @Input({ required: true }) user!: User | undefined;

    @HostBinding('class') cssClass = 'header';

    public headerMenuPosition: ConnectedPosition[] = [{
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 10,
    }];
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly rootRoute = ROOT_ROUTE;
}

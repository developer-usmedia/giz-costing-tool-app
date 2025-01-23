import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { User } from '@api/models';
import { AUTH_ROUTE, BreadcrumbItem, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CdkMenuTrigger, CdkMenu } from '@angular/cdk/menu';
import { MenuComponent } from '@shared/components/menu/menu.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';

@Component({
    selector: 'giz-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        BreadcrumbComponent,
        CdkMenuTrigger,
        CdkMenu,
        MenuComponent,
        ButtonComponent,
        RouterLink,
        SlicePipe,
    ],
})
export class HeaderComponent {
    @Input({ required: true }) breadcrumb!: BreadcrumbItem[];
    @Input() user?: User | undefined;

    @HostBinding('class') cssClass = 'header';

    public headerMenuPosition: ConnectedPosition[] = [{
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 10,
    }];
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly rootRoute = ROOT_ROUTE;
}

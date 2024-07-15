import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { BreadcrumbItem } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: [ './breadcrumb.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbComponent {
    @Input({ required: true }) breadcrumb: BreadcrumbItem[] = [];

    protected readonly icon = ICON;
}

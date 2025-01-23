import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { BreadcrumbItem } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'giz-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: [ './breadcrumb.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgClass,
        RouterLink,
        IconComponent,
    ],
})
export class BreadcrumbComponent {
    @Input({ required: true }) breadcrumb: BreadcrumbItem[] = [];

    protected readonly icon = ICON;
}

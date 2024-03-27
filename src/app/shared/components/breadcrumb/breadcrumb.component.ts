import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { BreadcrumbItem } from '@core/models';

@Component({
    selector: 'giz-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: [ './breadcrumb.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbComponent {
    @Input({ required: true }) breadcrumb: BreadcrumbItem[] = [];
}

import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

@Component({
    selector: 'giz-logos',
    templateUrl: './logos.component.html',
    styleUrl: './logos.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class LogosComponent {
    constructor(
        @Inject(APP_BASE_HREF) public baseHref: string,
    ) {}
}
